// bun test scripts/ledger.test.ts
// The interface is the test surface: every case below drives a real brain in a temp directory
// through the six ledger verbs. No process globals, no server, no fixtures named after clients.
import { expect, test, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openBrain, openBrainOrExit, resolveBrainDir, BrainNotFound, DIRS } from "./brain";
import { openLedger, setFields, yamlValue, addNote } from "./ledger";

function newBrain(files: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), "db-test-"));
  for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "sources.yaml"), "projects:\n  - slug: alpha\n    scope: personal\n  - slug: beta\n    scope: client:beta-co\n    aliases: [beta-site]\n");
  for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body);
  return openBrain(dir);
}

const candidate = (id: string, extra = "") => `---
id: ${id}
title: A rule that states one thing
dimension: color
scope: universal
stance: prefer
status: candidate
occurrences: [alpha]
evidence:
  - "repo:alpha/app.css"
last_seen: 2026-09-04
${extra}---

## Rule

Body text.

## Why

Because.
`;

describe("brain", () => {
  test("resolves from argv, then env, then cwd", () => {
    expect(resolveBrainDir(["bun", "x", "--brain", "/a"], { DESIGN_BRAIN: "/b" }, "/c")).toBe("/a");
    expect(resolveBrainDir(["bun", "x"], { DESIGN_BRAIN: "/b" }, "/c")).toBe("/b");
    expect(resolveBrainDir(["bun", "x"], {}, "/c")).toBe("/c");
  });

  test("throws rather than exiting when there is no brain", () => {
    expect(() => openBrain(mkdtempSync(join(tmpdir(), "db-empty-")))).toThrow(BrainNotFound);
  });

  test("exposes every directory as a path, with no string concatenation", () => {
    const b = newBrain();
    expect(b.inbox.endsWith("/inbox")).toBe(true);
    expect(b.path("exports", ".compile.json").endsWith("/exports/.compile.json")).toBe(true);
  });

  test("knows the brain's own project names, and which are clients", () => {
    const b = newBrain();
    expect(b.names().sort()).toEqual(["alpha", "beta", "beta-co", "beta-site"]);
    expect(b.clientSlugs().sort()).toEqual(["beta", "beta-site"]);
  });
});

describe("frontmatter", () => {
  test("quotes only what YAML would misread", () => {
    expect(yamlValue("personal")).toBe("personal");
    expect(yamlValue(7)).toBe("7");
    expect(yamlValue("client:beta")).toBe('"client:beta"');
    expect(yamlValue("no")).toBe('"no"');
    expect(yamlValue("A title: with a colon")).toBe('"A title: with a colon"');
    expect(yamlValue(["DB-001", "DB-002"])).toBe("[DB-001, DB-002]");
  });

  test("writes inside the frontmatter block, not the body", () => {
    const src = "---\nid: DB-c-001\nstatus: candidate\n---\n\n## Rule\n\nstatus: this line is prose.\n";
    const out = setFields(src, { status: "retired" });
    expect(out).toContain("status: retired");
    expect(out).toContain("status: this line is prose.");
    expect(out.match(/status: retired/g)!.length).toBe(1);
  });

  test("survives CRLF files", () => {
    const src = "---\r\nid: DB-c-001\r\nstatus: candidate\r\n---\r\n\r\n## Rule\r\n";
    const out = setFields(src, { promoted: "2026-09-04" });
    expect(out).toContain("promoted: 2026-09-04\r\n---");
    expect(out.startsWith("---\r\nid: DB-c-001")).toBe(true);
  });

  test("removes a field when the value is null", () => {
    const out = setFields("---\nid: DB-001\nresolution: \"x wins\"\n---\n\nbody\n", { resolution: null });
    expect(out).not.toContain("resolution:");
  });

  test("notes append under one heading, newest first", () => {
    const one = addNote("---\nid: DB-c-001\n---\n\n## Rule\n\nBody.\n", "first", "2026-09-01");
    const two = addNote(one, "second", "2026-09-02");
    expect(two.match(/## Review notes/g)!.length).toBe(1);
    expect(two.indexOf("second")).toBeLessThan(two.indexOf("first"));
  });
});

describe("ledger transitions", () => {
  test("confirm moves the file, allocates the next id and remembers where it came from", () => {
    const b = newBrain({ "inbox/DB-c-101-a-rule.md": candidate("DB-c-101") });
    const l = openLedger(b, () => "2026-09-04");
    const { id, file } = l.confirm("DB-c-101");
    expect(id).toBe("DB-001");
    expect(file).toBe("DB-001-a-rule.md");
    expect(existsSync(b.path("inbox", "DB-c-101-a-rule.md"))).toBe(false);
    const doc = l.get("DB-001");
    expect(doc.fm.status).toBe("confirmed");
    expect(doc.fm.was).toBe("DB-c-101");
    expect(doc.fm.promoted).toBe("2026-09-04");
  });

  test("ids keep counting up across promotions", () => {
    const b = newBrain({ "inbox/DB-c-101-a.md": candidate("DB-c-101"), "inbox/DB-c-102-b.md": candidate("DB-c-102") });
    const l = openLedger(b);
    expect(l.confirm("DB-c-101").id).toBe("DB-001");
    expect(l.confirm("DB-c-102").id).toBe("DB-002");
  });

  test("confirm applies edits in the same write", () => {
    const b = newBrain({ "inbox/DB-c-101-a.md": candidate("DB-c-101") });
    const l = openLedger(b, () => "2026-09-04");
    l.confirm("DB-c-101", { stance: "always", scope: "client:beta-co", note: "narrowed to the app" });
    const doc = l.get("DB-001");
    expect(doc.fm.stance).toBe("always");
    expect(doc.fm.scope).toBe("client:beta-co");
    expect(doc.body).toContain("- 2026-09-04: narrowed to the app");
  });

  test("a retired candidate cannot be confirmed", () => {
    const b = newBrain({ "inbox/DB-c-101-a.md": candidate("DB-c-101") });
    const l = openLedger(b);
    l.retire("DB-c-101");
    expect(() => l.confirm("DB-c-101")).toThrow(/not a candidate/);
  });

  test("restore reverses a confirmation, back to the original id and directory", () => {
    const b = newBrain({ "inbox/DB-c-101-a-rule.md": candidate("DB-c-101") });
    const l = openLedger(b);
    l.confirm("DB-c-101");
    expect(l.restore("DB-001").id).toBe("DB-c-101");
    expect(existsSync(b.path("inbox", "DB-c-101-a-rule.md"))).toBe(true);
    expect(readdirSync(b.decisions).length).toBe(0);
    const doc = l.get("DB-c-101");
    expect(doc.fm.status).toBe("candidate");
    expect(doc.fm.promoted).toBeUndefined();
    expect(doc.fm.was).toBeUndefined();
  });

  test("restore reverses a retirement", () => {
    const b = newBrain({ "inbox/DB-c-101-a.md": candidate("DB-c-101") });
    const l = openLedger(b);
    l.retire("DB-c-101");
    expect(l.get("DB-c-101").fm.status).toBe("retired");
    l.restore("DB-c-101");
    const doc = l.get("DB-c-101");
    expect(doc.fm.status).toBe("candidate");
    expect(doc.fm.retired).toBeUndefined();
  });

  test("conflicts round-trip as a list and clear to nothing", () => {
    const b = newBrain({ "inbox/DB-c-101-a.md": candidate("DB-c-101") });
    const l = openLedger(b);
    l.edit("DB-c-101", { conflicts_with: ["DB-001", "DB-c-102"], resolution: "the first wins on tools" });
    expect(l.get("DB-c-101").fm.conflicts_with).toEqual(["DB-001", "DB-c-102"]);
    expect(l.get("DB-c-101").fm.resolution).toBe("the first wins on tools");
    l.edit("DB-c-101", { conflicts_with: [], resolution: "" });
    expect(l.get("DB-c-101").fm.conflicts_with).toBeUndefined();
    expect(l.get("DB-c-101").fm.resolution).toBeUndefined();
  });

  test("a title with a colon survives the round trip", () => {
    const b = newBrain({ "inbox/DB-c-101-a.md": candidate("DB-c-101") });
    const l = openLedger(b);
    l.edit("DB-c-101", { title: "Absence has one rendering: never a dash" });
    expect(l.get("DB-c-101").fm.title).toBe("Absence has one rendering: never a dash");
  });

  test("listings separate candidates, confirmed and retired", () => {
    const b = newBrain({
      "inbox/DB-c-101-a.md": candidate("DB-c-101"),
      "inbox/DB-c-102-b.md": candidate("DB-c-102"),
      "inbox/_review-queue.md": "not a rule",
    });
    const l = openLedger(b);
    l.confirm("DB-c-101");
    l.retire("DB-c-102");
    expect(l.candidates().length).toBe(0);
    expect(l.confirmed().length).toBe(1);
    expect(l.retired().length).toBe(1);
    expect(l.all().length).toBe(2); // the underscore file is not a rule
  });

  test("an unknown id is an error, not a silent no-op", () => {
    const l = openLedger(newBrain());
    expect(() => l.get("DB-c-999")).toThrow(/no file for DB-c-999/);
  });
});

describe("adding a source", () => {
  const source = {
    title: "A modal names its primary action in a verb",
    dimension: "copy", stance: "always", kind: "practice" as const, component: "modals",
    rule: "The confirming button says what it does.",
    why: "A generic label makes the reader re-read the sentence above it.",
    evidence: ["reference:https://example.com/ok-cancel — Publisher, OK or Cancel"],
  };

  test("writes a candidate with an allocated id, never confirmed", () => {
    const l = openLedger(newBrain(), () => "2026-09-04");
    const { id, file } = l.add(source);
    expect(id).toBe("DB-c-800");
    expect(file).toBe("DB-c-800-a-modal-names-its-primary-action.md");
    const doc = l.get("DB-c-800");
    expect(doc.fm.status).toBe("candidate");
    expect(doc.fm.scope).toBe("universal");
    expect(doc.fm.source).toBe("added by hand");
    expect(doc.fm.component).toBe("modals");
    expect(doc.fm.evidence).toEqual(source.evidence);
    expect(doc.body).toContain("## Rule");
  });

  test("ids keep counting, and skip ones already confirmed out of the band", () => {
    const b = newBrain();
    const l = openLedger(b);
    expect(l.add(source).id).toBe("DB-c-800");
    expect(l.add({ ...source, title: "A second rule from the same page" }).id).toBe("DB-c-801");
    l.confirm("DB-c-800");
    expect(l.add({ ...source, title: "A third rule from the same page" }).id).toBe("DB-c-802");
  });

  test("refuses a reference kind with no reference", () => {
    const l = openLedger(newBrain());
    expect(() => l.add({ ...source, evidence: ["repo:somewhere"] })).toThrow(/needs a reference/);
  });

  test("refuses a title that would not fit two lines", () => {
    const l = openLedger(newBrain());
    expect(() => l.add({ ...source, title: "x".repeat(81) })).toThrow(/at most 80/);
  });

  test("refuses a candidate with no rule and no evidence", () => {
    const l = openLedger(newBrain());
    expect(() => l.add({ ...source, rule: "  " })).toThrow(/rule is required/);
    expect(() => l.add({ ...source, evidence: [] })).toThrow(/evidence/);
  });
});
