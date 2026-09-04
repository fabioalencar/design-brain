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

const skillsDir = (home: string) => join(home, ".claude", "skills");

export interface SkillInfo {
  name: string;
  exists: boolean;
  description?: string;
  words?: number;
  ids?: string[];
  mtime?: string;
  sections?: { level: number; title: string; rules: number }[];
  installed?: boolean;
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
  let installed = false;
  try {
    const link = join(skillsDir(home), name);
    installed = lstatSync(link).isSymbolicLink() && readlinkSync(link) === brain.path("skills", name);
  } catch {}
  return {
    name,
    exists: true,
    description,
    words: body.split(/\s+/).length,
    ids: [...new Set(body.match(/DB-(?:c-)?\d{3}/g) ?? [])],
    mtime: statSync(path).mtime.toISOString(),
    sections: sections.filter((x) => x.level === 2 || x.rules),
    installed,
    body,
  };
}

/** A hand-written skill the tool ships: no rules cited, never rebuilt by compile. */
export function readToolSkill(name: string, home = process.env.HOME ?? ""): SkillInfo {
  const path = join(toolRoot, "agent-skills", name, "SKILL.md");
  if (!existsSync(path)) return { name, exists: false };
  const content = readFileSync(path, "utf8");
  const description = content.match(/^description:\s*([\s\S]*?)\n---/m)?.[1]?.trim() ?? "";
  let installed = false;
  try {
    const link = join(skillsDir(home), name);
    installed = lstatSync(link).isSymbolicLink() && readlinkSync(link) === join(toolRoot, "agent-skills", name);
  } catch {}
  return { name, exists: true, description, installed, body: content.replace(/^---[\s\S]*?---\n/, "") };
}

export function lastCompile(brain: Brain): unknown {
  try {
    return JSON.parse(readFileSync(brain.path("exports", ".compile.json"), "utf8"));
  } catch {
    return null;
  }
}

/** Symlink this brain's compiled skills into ~/.claude/skills. Refuses to replace a real directory. */
export function installSkills(brain: Brain, home = process.env.HOME ?? ""): string[] {
  const dir = skillsDir(home);
  mkdirSync(dir, { recursive: true });
  const done: string[] = [];
  for (const name of SKILL_NAMES) {
    const src = brain.path("skills", name);
    const dest = join(dir, name);
    if (!existsSync(src)) throw new Error(`missing ${src}; compile first`);
    try {
      if (!lstatSync(dest).isSymbolicLink()) throw new Error(`${dest} exists and is not a symlink`);
      unlinkSync(dest);
    } catch (e: any) {
      if (e?.code !== "ENOENT") throw e;
    }
    symlinkSync(src, dest);
    done.push(name);
  }
  for (const name of TOOL_SKILLS) {
    const src = join(toolRoot, "agent-skills", name);
    const dest = join(dir, name);
    if (!existsSync(src)) continue;
    try {
      if (!lstatSync(dest).isSymbolicLink()) throw new Error(`${dest} exists and is not a symlink`);
      unlinkSync(dest);
    } catch (e: any) {
      if (e?.code !== "ENOENT") throw e;
    }
    symlinkSync(src, dest);
    done.push(name);
  }
  return done;
}
