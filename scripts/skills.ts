// The compiled skills: their names, what a built one contains, and how it is installed.
// One module so the CLI and the review app cannot disagree about either.
import { existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, statSync, symlinkSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import type { Brain } from "./brain";
import { toolRoot } from "./lib";

export const SKILL_NAMES = ["design-brain", "design-brain-check", "design-brain-start"] as const;
/** Hand-written, shipped by the tool rather than compiled from a brain. */
export const TOOL_SKILLS = ["design-brain-add-source"] as const;
export type SkillName = (typeof SKILL_NAMES)[number];

/** Where each coding agent reads skills from. `always` targets exist on every machine we support;
 *  the rest are used only when that agent's home directory is present, so installing never
 *  scatters directories for tools the designer does not run. `~/.agents/skills` is the open
 *  Agent Skills location, which Codex reads. */
export interface SkillTarget { agent: string; dir: string }
export function skillTargets(home: string): SkillTarget[] {
  const t: SkillTarget[] = [
    { agent: "claude", dir: join(home, ".claude", "skills") },
    { agent: "codex", dir: join(home, ".agents", "skills") },
  ];
  const optional: [string, string[]][] = [
    ["gemini", [".gemini"]], ["copilot", [".copilot"]], ["cursor", [".cursor"]], ["opencode", [".config", "opencode"]],
  ];
  for (const [agent, homeDir] of optional) if (existsSync(join(home, ...homeDir))) t.push({ agent, dir: join(home, ...homeDir, "skills") });
  return t;
}

const linkedAt = (dir: string, name: string, src: string) => {
  try { const l = join(dir, name); return lstatSync(l).isSymbolicLink() && readlinkSync(l) === src; } catch { return false; }
};
/** Agents this skill is linked for, given where it lives. */
export function installedIn(src: string, name: string, home: string): string[] {
  return skillTargets(home).filter((t) => linkedAt(t.dir, name, src)).map((t) => t.agent);
}

export interface SkillInfo {
  name: string;
  exists: boolean;
  description?: string;
  words?: number;
  ids?: string[];
  mtime?: string;
  sections?: { level: number; title: string; rules: number }[];
  /** Linked for every agent on this machine. */
  installed?: boolean;
  installedIn?: string[];
  body?: string;
}

export function readSkill(brain: Brain, name: string, home = process.env.HOME ?? ""): SkillInfo {
  const path = brain.path("skills", name, "SKILL.md");
  if (!existsSync(path)) return { name, exists: false };
  const content = readFileSync(path, "utf8");
  const description = content.match(/^description:\s*"?([\s\S]*?)"?\n---/m)?.[1]?.replace(/\\"/g, '"') ?? "";
  const body = content.replace(/^---[\s\S]*?---\n/, "");
  const sections = [...body.matchAll(/^(##+)\s+(.+)$/gm)].map((m) => ({ level: m[1].length, title: m[2].trim(), rules: 0 }));
  let cur = -1;
  for (const line of body.split("\n")) {
    if (/^##+\s/.test(line)) cur++;
    else if (/^- \*\*/.test(line) && cur >= 0 && sections[cur]) sections[cur].rules++;
  }
  const where = installedIn(brain.path("skills", name), name, home);
  return {
    name,
    exists: true,
    description,
    words: body.split(/\s+/).length,
    ids: [...new Set(body.match(/DB-(?:c-)?\d{3}/g) ?? [])],
    mtime: statSync(path).mtime.toISOString(),
    sections: sections.filter((x) => x.level === 2 || x.rules),
    installed: where.length === skillTargets(home).length,
    installedIn: where,
    body,
  };
}

/** A hand-written skill the tool ships: no rules cited, never rebuilt by compile. */
export function readToolSkill(name: string, home = process.env.HOME ?? ""): SkillInfo {
  const path = join(toolRoot, "agent-skills", name, "SKILL.md");
  if (!existsSync(path)) return { name, exists: false };
  const content = readFileSync(path, "utf8");
  const description = content.match(/^description:\s*([\s\S]*?)\n---/m)?.[1]?.trim() ?? "";
  const where = installedIn(join(toolRoot, "agent-skills", name), name, home);
  return { name, exists: true, description, installed: where.length === skillTargets(home).length, installedIn: where, body: content.replace(/^---[\s\S]*?---\n/, "") };
}

export function lastCompile(brain: Brain): unknown {
  try {
    return JSON.parse(readFileSync(brain.path("exports", ".compile.json"), "utf8"));
  } catch {
    return null;
  }
}

export interface Installed { agent: string; dir: string; skills: string[] }

/** Symlink this brain's compiled skills, and the tool's hand-written ones, into every agent's
 *  skills directory on this machine. Idempotent. Refuses to replace a real directory. */
export function installSkills(brain: Brain, home = process.env.HOME ?? ""): Installed[] {
  const sources: [string, string][] = [
    ...SKILL_NAMES.map((n): [string, string] => [n, brain.path("skills", n)]),
    ...TOOL_SKILLS.map((n): [string, string] => [n, join(toolRoot, "agent-skills", n)]),
  ];
  for (const [name, src] of sources) if (!existsSync(src) && (SKILL_NAMES as readonly string[]).includes(name)) throw new Error(`missing ${src}; compile first`);
  const out: Installed[] = [];
  for (const target of skillTargets(home)) {
    mkdirSync(target.dir, { recursive: true });
    const done: string[] = [];
    for (const [name, src] of sources) {
      if (!existsSync(src)) continue;
      const dest = join(target.dir, name);
      try {
        if (!lstatSync(dest).isSymbolicLink()) throw new Error(`${dest} exists and is not a symlink`);
        unlinkSync(dest);
      } catch (e: any) {
        if (e?.code !== "ENOENT") throw e;
      }
      symlinkSync(src, dest);
      done.push(name);
    }
    out.push({ ...target, skills: done });
  }
  return out;
}
