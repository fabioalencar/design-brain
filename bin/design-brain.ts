#!/usr/bin/env bun
// design-brain <command> [--brain <dir>] — runs the tool against a brain directory.
import { existsSync, mkdirSync, readdirSync, copyFileSync, writeFileSync, symlinkSync, lstatSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { toolRoot } from "../scripts/lib";

const [cmd, ...rest] = process.argv.slice(2);
const home = process.env.HOME ?? "";
const scripts: Record<string, string> = {
  check: "check.ts", compile: "compile-skills.ts", review: "review-server.ts",
  "harvest:transcripts": "harvest-transcripts.ts", "harvest:repos": "harvest-repos.ts",
  promote: "promote.ts promote", retire: "promote.ts retire", rescope: "promote.ts rescope",
};

function run(script: string, args: string[]) {
  const [file, ...pre] = script.split(" ");
  const p = Bun.spawnSync(["bun", ...(cmd === "review" ? ["--watch"] : []), join(toolRoot, "scripts", file), ...pre, ...args], { stdio: ["inherit", "inherit", "inherit"] });
  process.exit(p.exitCode ?? 1);
}

function init(dirArg?: string) {
  if (!dirArg) { console.error("usage: design-brain init <dir>"); process.exit(1); }
  const dir = resolve(dirArg.replace(/^~(?=$|\/)/, home));
  if (existsSync(join(dir, "sources.yaml"))) { console.error(`${dir} already has a brain (sources.yaml).`); process.exit(1); }
  for (const d of ["inbox", "decisions", "patterns", "inventory", "skills", "exports", "evals"]) mkdirSync(join(dir, d), { recursive: true });
  for (const f of readdirSync(join(toolRoot, "templates", "brain"))) copyFileSync(join(toolRoot, "templates", "brain", f), join(dir, f));
  let n = 0;
  for (const f of readdirSync(join(toolRoot, "seed"))) { copyFileSync(join(toolRoot, "seed", f), join(dir, "inbox", f)); n++; }
  console.log(`Brain created at ${dir}\n  ${n} reference candidates seeded into inbox/ (heuristics, biases, component practices)\n  next: edit sources.yaml, then \`design-brain harvest:repos\` and \`design-brain review\` from that directory`);
}

function install(dirArg?: string) {
  const dir = resolve((dirArg ?? process.cwd()).replace(/^~(?=$|\/)/, home));
  const skillsDir = join(home, ".claude", "skills");
  mkdirSync(skillsDir, { recursive: true });
  for (const name of ["design-brain", "design-brain-check", "design-brain-start"]) {
    const src = join(dir, "skills", name), dest = join(skillsDir, name);
    if (!existsSync(src)) { console.error(`missing ${src}; run design-brain compile first`); process.exit(1); }
    if (existsSync(dest) || (() => { try { lstatSync(dest); return true; } catch { return false; } })()) {
      if (!lstatSync(dest).isSymbolicLink()) { console.error(`${dest} exists and is not a symlink; refusing`); process.exit(1); }
      unlinkSync(dest);
    }
    symlinkSync(src, dest);
    console.log(`${dest} → ${src}`);
  }
}

if (cmd === "init") init(rest[0]);
else if (cmd === "install") install(rest.find((a) => !a.startsWith("--")));
else if (cmd && scripts[cmd]) run(scripts[cmd], rest);
else {
  console.log(`design-brain — a personal design ledger compiled into agent skills

  init <dir>            create a brain seeded with reference heuristics, biases, practices
  review                open the swipe review queue (http://localhost:4455)
  check                 validate inbox/, decisions/, patterns/
  compile [--preview]   build skills/ and exports/ from confirmed decisions
  harvest:repos         extract design facts from the projects in sources.yaml
  harvest:transcripts   mine Claude Code transcripts for design directives
  promote|retire|rescope <DB-c-###> …
  install [dir]         symlink the brain's skills into ~/.claude/skills

All commands take --brain <dir> (default: current directory, or $DESIGN_BRAIN).`);
  process.exit(cmd ? 1 : 0);
}
