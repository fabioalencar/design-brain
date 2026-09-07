// bun test scripts/skills.test.ts
// Installing links a brain's skills into every agent present in a fake home. Asserted: which
// directories receive links, where they point, and what readSkill reports afterwards.
import { expect, test, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, lstatSync, readlinkSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DIRS, openBrain } from "./brain";
import { SKILL_NAMES, TOOL_SKILLS, installSkills, readSkill, skillTargets } from "./skills";

function fakeHome(agents: string[][]) {
  const home = mkdtempSync(join(tmpdir(), "db-skills-home-"));
  for (const a of agents) mkdirSync(join(home, ...a), { recursive: true });
  return home;
}

function brainWithSkills() {
  const dir = mkdtempSync(join(tmpdir(), "db-skills-brain-"));
  for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "sources.yaml"), "projects: []\n");
  for (const n of SKILL_NAMES) {
    mkdirSync(join(dir, "skills", n), { recursive: true });
    writeFileSync(join(dir, "skills", n, "SKILL.md"), `---\nname: ${n}\ndescription: "t"\n---\n## Rules\n`);
  }
  return openBrain(dir);
}

describe("skillTargets", () => {
  test("Claude and the open Agent Skills dir always; other agents only when their home exists", () => {
    const home = fakeHome([[".gemini"], [".config", "opencode"]]);
    expect(skillTargets(home).map((t) => t.agent)).toEqual(["claude", "codex", "gemini", "opencode"]);
    expect(skillTargets(fakeHome([])).map((t) => t.agent)).toEqual(["claude", "codex"]);
  });
});

describe("installSkills", () => {
  test("links every skill into every target and reports it", () => {
    const home = fakeHome([[".gemini"], [".cursor"]]);
    const brain = brainWithSkills();
    const out = installSkills(brain, home);
    expect(out.map((t) => t.agent)).toEqual(["claude", "codex", "gemini", "cursor"]);
    for (const t of out) {
      expect(t.skills).toEqual([...SKILL_NAMES, ...TOOL_SKILLS]);
      for (const n of SKILL_NAMES) {
        const link = join(t.dir, n);
        expect(lstatSync(link).isSymbolicLink()).toBe(true);
        expect(readlinkSync(link)).toBe(brain.path("skills", n));
      }
    }
    expect(existsSync(join(home, ".agents", "skills", "design-brain"))).toBe(true);
    expect(existsSync(join(home, ".copilot"))).toBe(false);
  });

  test("is idempotent and readSkill sees the result", () => {
    const home = fakeHome([[".copilot"]]);
    const brain = brainWithSkills();
    installSkills(brain, home);
    installSkills(brain, home);
    const s = readSkill(brain, "design-brain", home);
    expect(s.installed).toBe(true);
    expect(s.installedIn).toEqual(["claude", "codex", "copilot"]);
  });

  test("reports a partial install honestly", () => {
    const home = fakeHome([]);
    const brain = brainWithSkills();
    installSkills(brain, home);
    mkdirSync(join(home, ".gemini"));
    const s = readSkill(brain, "design-brain", home);
    expect(s.installed).toBe(false);
    expect(s.installedIn).toEqual(["claude", "codex"]);
  });

  test("refuses to replace a real directory", () => {
    const home = fakeHome([]);
    const brain = brainWithSkills();
    mkdirSync(join(home, ".claude", "skills", "design-brain"), { recursive: true });
    expect(() => installSkills(brain, home)).toThrow(/exists and is not a symlink/);
  });

  test("demands a compiled brain", () => {
    const home = fakeHome([]);
    const dir = mkdtempSync(join(tmpdir(), "db-skills-empty-"));
    for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
    writeFileSync(join(dir, "sources.yaml"), "projects: []\n");
    expect(() => installSkills(openBrain(dir), home)).toThrow(/compile first/);
  });
});
