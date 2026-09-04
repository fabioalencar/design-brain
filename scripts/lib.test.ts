// bun test scripts/lib.test.ts
// The pure helpers every script shares: finding a section in a body, spotting paragraphs too long
// for the review card, reading an evidence line, reading a scope, and pairing up unresolved
// conflicts. Docs come from a real brain in a temp directory, never from a hand-built object.
import { expect, test, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openBrain, DIRS } from "./brain";
import { listDocs, section, longParagraphs, parseEvidence, scopeKind, conflictsOf, unresolvedConflicts, EVIDENCE_LABELS, PARA_MAX } from "./lib";

function newBrain(files: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), "db-lib-"));
  for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "sources.yaml"), "projects:\n  - slug: meridian\n    scope: personal\n");
  for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body);
  return openBrain(dir);
}

const decision = (id: string, extra = "") => `---
id: ${id}
title: A rule that states one thing
dimension: color
scope: universal
stance: prefer
status: confirmed
confidence: 6
occurrences: [meridian]
evidence:
  - "repo:meridian/app.css"
last_seen: 2026-09-04
${extra}---

## Rule

Body text.
`;

const docsOf = (files: Record<string, string>) => {
  const b = newBrain(files);
  const by = new Map(listDocs(b.decisions).map((d) => [String(d.fm.id), d]));
  return { all: [...by.values()], get: (id: string) => by.get(id)! };
};

describe("reading a body", () => {
  const body = "## Rule\n\nOne sentence.\n\n## Why\n\nBecause.\n";
  const long = "w".repeat(PARA_MAX + 1);

  test("a heading that is not there reads as empty, not as an error", () => {
    expect(section(body, "Examples")).toBe("");
    expect(section("no headings at all", "Rule")).toBe("");
  });

  test("the heading matches on a word boundary, so Rule is not Rules", () => {
    const other = "## Rules of thumb\n\nNot the rule.\n";
    expect(section(other, "Rule")).toBe("");
    expect(section(other, "Rules of thumb")).toBe("Not the rule.");
  });

  test("content stops at the next heading", () => {
    expect(section(body, "Rule")).toBe("One sentence.");
    expect(section(body, "Why")).toBe("Because.");
  });

  test("only Rule and Why are measured for length", () => {
    expect(longParagraphs(`## Rule\n\n${long}\n\n## Examples\n\n${long}\n`)).toEqual([{ section: "Rule", chars: PARA_MAX + 1 }]);
  });

  test("a list item is exempt however long it runs", () => {
    expect(longParagraphs(`## Why\n\n- ${long}\n`)).toEqual([]);
    expect(longParagraphs(`## Why\n\n* ${long}\n`)).toEqual([]);
  });

  test("the threshold is 300 characters, and 300 is short enough", () => {
    expect(longParagraphs(`## Rule\n\n${"w".repeat(PARA_MAX)}\n`)).toEqual([]);
    expect(longParagraphs(`## Rule\n\n${long}\n`).length).toBe(1);
  });
});

describe("parseEvidence", () => {
  test("every type it knows gets its own label", () => {
    for (const [type, label] of Object.entries(EVIDENCE_LABELS)) {
      const e = parseEvidence(`${type}:something`)!;
      expect(e.type).toBe(type);
      expect(e.label).toBe(label);
    }
  });

  test("a quote is separated from what it points at", () => {
    const e = parseEvidence('transcript:a-project:2026-01-14 "não, definitivamente não"')!;
    expect(e.type).toBe("transcript");
    expect(e.label).toBe("said");
    expect(e.ref).toBe("a-project:2026-01-14");
    expect(e.quote).toBe("não, definitivamente não");
  });

  test("a line without a quote keeps the whole reference and an empty quote", () => {
    const e = parseEvidence("repo:~/Code/a-project/app.css")!;
    expect(e.ref).toBe("~/Code/a-project/app.css");
    expect(e.quote).toBe("");
    expect(e.url).toBeUndefined();
  });

  test("a reference hands back the url on its own", () => {
    const e = parseEvidence("reference:https://example.com/study — A Publisher")!;
    expect(e.label).toBe("source");
    expect(e.url).toBe("https://example.com/study");
    expect(e.ref).toBe("https://example.com/study — A Publisher");
  });

  test("a line that is not evidence is null, not a half-parsed record", () => {
    expect(parseEvidence("just a sentence someone typed")).toBeNull();
    expect(parseEvidence("DB-001: not a type")).toBeNull();
    expect(parseEvidence("")).toBeNull();
  });
});

test("scopeKind names the five things a scope can be", () => {
  expect(scopeKind("universal")).toBe("universal");
  expect(scopeKind("personal")).toBe("personal");
  expect(scopeKind("client:a-client")).toBe("client");
  expect(scopeKind("project:a-project")).toBe("project");
  expect(scopeKind("Client:Shouty")).toBe("invalid");
  expect(scopeKind(undefined)).toBe("invalid");
});

describe("conflicts", () => {
  test("conflicts_with reads as a list, a bare id, or nothing", () => {
    const d = docsOf({
      "decisions/DB-001-a.md": decision("DB-001", "conflicts_with: [DB-002, DB-003]\n"),
      "decisions/DB-002-b.md": decision("DB-002", "conflicts_with: DB-001\n"),
      "decisions/DB-003-c.md": decision("DB-003"),
    });
    expect(conflictsOf(d.get("DB-001"))).toEqual(["DB-002", "DB-003"]);
    expect(conflictsOf(d.get("DB-002"))).toEqual(["DB-001"]);
    expect(conflictsOf(d.get("DB-003"))).toEqual([]);
  });

  test("a declared pair with no resolution on either side is unresolved", () => {
    const d = docsOf({
      "decisions/DB-001-a.md": decision("DB-001", "conflicts_with: [DB-002]\n"),
      "decisions/DB-002-b.md": decision("DB-002"),
    });
    const pairs = unresolvedConflicts(d.all);
    expect(pairs.length).toBe(1);
    expect([pairs[0].a.fm.id, pairs[0].b.fm.id].sort()).toEqual(["DB-001", "DB-002"]);
  });

  test("a resolution on either side settles the pair", () => {
    const res = 'resolution: "DB-001 wins inside the app"\n';
    const onA = docsOf({
      "decisions/DB-001-a.md": decision("DB-001", "conflicts_with: [DB-002]\n" + res),
      "decisions/DB-002-b.md": decision("DB-002"),
    });
    const onB = docsOf({
      "decisions/DB-001-a.md": decision("DB-001", "conflicts_with: [DB-002]\n"),
      "decisions/DB-002-b.md": decision("DB-002", res),
    });
    expect(unresolvedConflicts(onA.all)).toEqual([]);
    expect(unresolvedConflicts(onB.all)).toEqual([]);
  });

  test("an id that names nothing here is not a pair", () => {
    const d = docsOf({ "decisions/DB-001-a.md": decision("DB-001", "conflicts_with: [DB-c-404]\n") });
    expect(unresolvedConflicts(d.all)).toEqual([]);
  });

  test("a pair both sides declared is reported once, not twice", () => {
    const d = docsOf({
      "decisions/DB-001-a.md": decision("DB-001", "conflicts_with: [DB-002]\n"),
      "decisions/DB-002-b.md": decision("DB-002", "conflicts_with: [DB-001]\n"),
    });
    expect(unresolvedConflicts(d.all).length).toBe(1);
  });

  test("it finds the pair whichever side declared it, low id or high", () => {
    const d = docsOf({
      "decisions/DB-001-a.md": decision("DB-001"),
      "decisions/DB-002-b.md": decision("DB-002", "conflicts_with: [DB-001]\n"),
    });
    expect(unresolvedConflicts(d.all).length).toBe(1);
  });
});
