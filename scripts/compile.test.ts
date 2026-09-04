// bun test scripts/compile.test.ts
// The compiler is a top-level script that exits, so it is run the way a user runs it: as a
// subprocess against a real brain in a temp directory. What is asserted is what it leaves on
// disk and what it prints — never how it got there.
import { expect, test, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { DIRS } from "./brain";
import { toolRoot } from "./lib";

const SCRIPT = join(toolRoot, "scripts", "compile-skills.ts");

function newBrain(files: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), "db-compile-"));
  for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "sources.yaml"), "projects:\n  - slug: meridian\n    scope: personal\n  - slug: saltmarsh\n    scope: client:saltmarsh-co\n");
  for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body);
  return dir;
}

function compile(dir: string) {
  const r = Bun.spawnSync(["bun", SCRIPT, "--brain", dir]);
  return { code: r.exitCode, out: r.stdout.toString() + r.stderr.toString() };
}

const skill = (dir: string, name: string) => readFileSync(join(dir, "skills", name, "SKILL.md"), "utf8");

interface Opts { title?: string; stance?: string; scope?: string; rule?: string }
const decision = (id: string, o: Opts = {}, extra = "") => `---
id: ${id}
title: ${o.title ?? "A rule that states one thing"}
dimension: color
scope: ${o.scope ?? "universal"}
stance: ${o.stance ?? "prefer"}
status: confirmed
occurrences: [meridian]
evidence:
  - "repo:app.css"
last_seen: 2026-09-04
${extra}---

## Rule

${o.rule ?? "Every surface picks one of the two and stays there."}

## Why

Because.
`;

describe("a clean brain", () => {
  test("writes the three skills and the exports, and reports what it compiled", () => {
    const dir = newBrain({ "decisions/DB-001-a.md": decision("DB-001") });
    const { code, out } = compile(dir);
    expect(code).toBe(0);
    for (const name of ["design-brain", "design-brain-check", "design-brain-start"]) {
      expect(existsSync(join(dir, "skills", name, "SKILL.md"))).toBe(true);
    }
    for (const f of ["taste-profile.json", "learnings.jsonl", "CLAUDE-snippet.md", ".compile.json"]) {
      expect(existsSync(join(dir, "exports", f))).toBe(true);
    }
    expect(out).toContain("compiled 1 harvested");
    expect(out).not.toContain("leak");
  });

  test("a confirmed decision reaches the main skill as its title and its rule", () => {
    const dir = newBrain({
      "decisions/DB-001-a.md": decision("DB-001", { title: "Absence has one rendering", rule: "An empty cell shows the same mark everywhere in the product." }),
    });
    expect(compile(dir).code).toBe(0);
    const s = skill(dir, "design-brain");
    expect(s).toContain("**Prefer: Absence has one rendering**");
    expect(s).toContain("(DB-001, seen in 1 project)");
    expect(s).toContain("An empty cell shows the same mark everywhere in the product.");
  });

  test("a never rule with weight behind it becomes a non-negotiable at kickoff", () => {
    const dir = newBrain({
      "decisions/DB-001-a.md": decision("DB-001", { title: "Never nag a reader who declined", stance: "never" }),
      "decisions/DB-002-b.md": decision("DB-002", { title: "A soft default about spacing", stance: "prefer" }),
    });
    expect(compile(dir).code).toBe(0);
    const start = skill(dir, "design-brain-start");
    expect(start).toContain("## 3. Non-negotiables");
    expect(start).toContain("**Never: Never nag a reader who declined**");
    expect(start).not.toContain("A soft default about spacing");
  });

  test("emitted paths point at the brain that compiled them, not at the tool", () => {
    const dir = newBrain({ "decisions/DB-001-a.md": decision("DB-001") });
    expect(compile(dir).code).toBe(0);
    const s = skill(dir, "design-brain");
    expect(s).toContain(join(basename(dir), "sources.yaml"));
    expect(s).toContain(join(basename(dir), "inventory"));
    expect(s).not.toContain(toolRoot);
    expect(readFileSync(join(dir, "exports", "CLAUDE-snippet.md"), "utf8")).toContain(join(basename(dir), "inbox"));
  });
});

describe("the DDR-010 conflict guard", () => {
  const pair = {
    "decisions/DB-001-a.md": decision("DB-001", { title: "The app stays calm and dense" }, "conflicts_with: [DB-002]\n"),
    "decisions/DB-002-b.md": decision("DB-002", { title: "Marketing may be loud" }),
  };

  test("two confirmed rules that conflict with no resolution stop the compile and write nothing", () => {
    const dir = newBrain(pair);
    const { code, out } = compile(dir);
    expect(code).not.toBe(0);
    expect(out).toContain("DDR-010: 1 unresolved conflict(s)");
    expect(out).toContain("DB-001");
    expect(out).toContain("DB-002");
    expect(existsSync(join(dir, "skills", "design-brain", "SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, "exports", "taste-profile.json"))).toBe(false);
  });

  test("a resolution on one side lets it compile, and the precedence shows in the skill", () => {
    const dir = newBrain({
      ...pair,
      "decisions/DB-001-a.md": decision("DB-001", { title: "The app stays calm and dense" }, 'conflicts_with: [DB-002]\nresolution: "DB-002 wins on marketing pages; this rule owns the app"\n'),
    });
    const { code, out } = compile(dir);
    expect(code).toBe(0);
    expect(out).not.toContain("DDR-010");
    expect(skill(dir, "design-brain")).toContain("_Precedence over DB-002:_ DB-002 wins on marketing pages; this rule owns the app");
  });
});

test("the DDR-005 leak guard names the line where a rule carries a project slug", () => {
  const dir = newBrain({
    "decisions/DB-001-a.md": decision("DB-001", { title: "The meridian header keeps one weight" }),
  });
  const { code, out } = compile(dir);
  expect(code).toBe(1); // DDR-005: a leak stops the compile, as CLAUDE.md and DDR-010 say it does
  expect(out).toContain("leak  skills/design-brain/SKILL.md:");
  expect(out).toContain("DDR-005:");
  expect(out).toContain("name a project");
});
