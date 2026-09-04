#!/usr/bin/env bun
// design-brain <command> [--brain <dir>] — runs the tool against a brain directory.
import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { toolRoot } from "../scripts/lib";
import { DIRS, expandHome, openBrain } from "../scripts/brain";
import { installSkills } from "../scripts/skills";

const [cmd, ...rest] = process.argv.slice(2);
const home = process.env.HOME ?? "";
const scripts: Record<string, string> = {
  check: "check.ts", compile: "compile-skills.ts", review: "review-server.ts",
  "harvest:transcripts": "harvest-transcripts.ts", "harvest:repos": "harvest-repos.ts",
  promote: "promote.ts promote", retire: "promote.ts retire", restore: "promote.ts restore",
  rescope: "promote.ts rescope", note: "promote.ts note",
};

function run(script: string, args: string[]) {
  const [file, ...pre] = script.split(" ");
  const p = Bun.spawnSync(["bun", ...(cmd === "review" ? ["--watch"] : []), join(toolRoot, "scripts", file), ...pre, ...args], { stdio: ["inherit", "inherit", "inherit"] });
  process.exit(p.exitCode ?? 1);
}

function init(dirArg?: string) {
  if (!dirArg) { console.error("usage: design-brain init <dir>"); process.exit(1); }
  const dir = resolve(expandHome(dirArg));
  if (existsSync(join(dir, "sources.yaml"))) { console.error(`${dir} already has a brain (sources.yaml).`); process.exit(1); }
  for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
  for (const f of readdirSync(join(toolRoot, "templates", "brain"))) copyFileSync(join(toolRoot, "templates", "brain", f), join(dir, f));
  let n = 0;
  for (const f of readdirSync(join(toolRoot, "seed"))) { copyFileSync(join(toolRoot, "seed", f), join(dir, "inbox", f)); n++; }
  console.log(`Brain created at ${dir}\n  ${n} reference candidates seeded into inbox/ (heuristics, biases, component practices)\n  next: edit sources.yaml, then \`design-brain harvest:repos\` and \`design-brain review\` from that directory`);
}

function install(dirArg?: string) {
  try {
    const brain = openBrain(dirArg ?? process.cwd());
    for (const name of installSkills(brain, home)) console.log(`${join(home, ".claude", "skills", name)} → ${brain.path("skills", name)}`);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
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
  compile               build skills/ and exports/ from the confirmed decisions
  harvest:repos         extract design facts from the projects in sources.yaml
  harvest:transcripts   mine Claude Code transcripts for design directives
  promote|retire|restore <DB-c-###> …
  rescope <id> <scope>  |  note <id> <text>
  install [dir]         symlink the brain's skills into ~/.claude/skills

All commands take --brain <dir> (default: current directory, or $DESIGN_BRAIN).`);
  process.exit(cmd ? 1 : 0);
}
