// bun test scripts/check.test.ts
// check.ts is the gate before anything is compiled, so it is run as a subprocess the way a user
// runs it, against a real brain in a temp directory. Each case asserts the exit code and the
// sentence a reader would act on — an error fails the run, a warning does not.
import { expect, test, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DIRS } from "./brain";
import { toolRoot } from "./lib";

const SCRIPT = join(toolRoot, "scripts", "check.ts");

function newBrain(files: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), "db-check-"));
  for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "sources.yaml"), "projects:\n  - slug: meridian\n    scope: personal\n  - slug: saltmarsh\n    scope: client:saltmarsh-co\n");
  for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body);
  return dir;
}

function check(files: Record<string, string>) {
  const r = Bun.spawnSync(["bun", SCRIPT, "--brain", newBrain(files)]);
  return { code: r.exitCode, out: r.stdout.toString() + r.stderr.toString() };
}

interface Opts { id?: string; title?: string; status?: string; scope?: string; occurrences?: string; kind?: string; evidence?: string; rule?: string; why?: string }
const doc = (o: Opts = {}) => `---
id: ${o.id ?? "DB-c-101"}
title: ${o.title ?? "A rule that states one thing"}
dimension: color
scope: ${o.scope ?? "universal"}
stance: prefer
status: ${o.status ?? "candidate"}
${o.kind ? `kind: ${o.kind}\n` : ""}occurrences: [${o.occurrences ?? "meridian"}]
evidence:
  - "${o.evidence ?? "repo:app.css"}"
last_seen: 2026-09-04
---

${o.rule ?? "## Rule\n\nEvery surface picks one of the two and stays there."}

## Why

Because.
`;

const confirmed = (o: Opts = {}) => doc({ id: "DB-001", status: "confirmed", ...o });

describe("a brain that is in order", () => {
  test("a candidate and a confirmed decision pass, and it says what it counted", () => {
    const { code, out } = check({
      "inbox/DB-c-101-a.md": doc(),
      "decisions/DB-001-b.md": confirmed(),
    });
    expect(code).toBe(0);
    expect(out).toContain("2 decisions/candidates");
    expect(out).toContain("0 errors");
    expect(out).not.toContain("error ");
  });
});

describe("errors that fail the run", () => {
  test("a body with no '## Rule' is an error", () => {
    const { code, out } = check({ "inbox/DB-c-101-a.md": doc({ rule: "## Guidance\n\nSomething else entirely." }) });
    expect(code).toBe(1);
    expect(out).toContain("inbox/DB-c-101-a.md: missing '## Rule'");
  });

  test("a title over 80 characters is an error, with the length in the message", () => {
    const title = "A rule so long that it wraps past two lines on the review card and keeps on going";
    const { code, out } = check({ "inbox/DB-c-101-a.md": doc({ title }) });
    expect(title.length).toBeGreaterThan(80);
    expect(code).toBe(1);
    expect(out).toContain(`title is ${title.length} chars; max 80`);
  });

  test("an id that is not DB-### or DB-c-### is an error", () => {
    const { code, out } = check({ "inbox/DB-c-101-a.md": doc({ id: "DB-1" }) });
    expect(code).toBe(1);
    expect(out).toContain("id must be DB-###/DB-c-###");
  });

  test("the same id in two files is an error that names both", () => {
    const { code, out } = check({
      "inbox/DB-c-101-a.md": doc(),
      "inbox/DB-c-101-b.md": doc(),
    });
    expect(code).toBe(1);
    expect(out).toContain("duplicate id DB-c-101 (also inbox/DB-c-101-a.md)");
  });

  test("a file in decisions/ that is not confirmed is an error", () => {
    const { code, out } = check({ "decisions/DB-001-a.md": doc({ id: "DB-001" }) });
    expect(code).toBe(1);
    expect(out).toContain("decisions/DB-001-a.md: decisions/ file must be confirmed");
  });

  test("a personal rule seen only in client work is an error", () => {
    const only = check({ "inbox/DB-c-101-a.md": doc({ scope: "personal", occurrences: "saltmarsh" }) });
    expect(only.code).toBe(1);
    expect(only.out).toContain("personal scope but only client occurrences");
    const mixed = check({ "inbox/DB-c-101-a.md": doc({ scope: "personal", occurrences: "saltmarsh, meridian" }) });
    expect(mixed.code).toBe(0);
  });

  test("a heuristic with no reference: evidence is an error", () => {
    const without = check({ "inbox/DB-c-101-a.md": doc({ kind: "heuristic" }) });
    expect(without.code).toBe(1);
    expect(without.out).toContain("heuristic needs a reference: evidence line");
    const with_ = check({ "inbox/DB-c-101-a.md": doc({ kind: "heuristic", evidence: "reference:https://example.com/heuristics — A Publisher" }) });
    expect(with_.code).toBe(0);
  });
});

test("a paragraph longer than the card is a warning, and the run still passes", () => {
  const { code, out } = check({
    "inbox/DB-c-101-a.md": doc({ rule: `## Rule\n\n${"word ".repeat(70).trim()}` }),
  });
  expect(code).toBe(0);
  expect(out).toContain("warn ");
  expect(out).toContain("Rule paragraph is");
  expect(out).toContain("1 warnings");
  expect(out).toContain("0 errors");
});
