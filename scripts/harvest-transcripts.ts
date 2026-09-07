// Mines the designer's own words out of coding-agent sessions (Claude Code, Codex, or any folder
// of exported chats a project points at), keeps the turns that read like design directives, and
// writes them to inbox/_review-queue.md for an agent (or the designer) to turn into candidates.
// Sessions are attributed to projects by working directory; see transcripts.ts.
// Re-runnable: remembers the last timestamp per project and agent in .cache/state.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { listDocs } from "./lib";
import { openBrainOrExit } from "./brain";
import { collectTurns, looksLikeDirective, type ProjectRef } from "./transcripts";

const brain = openBrainOrExit();
const root = brain.root;
const home = process.env.HOME!;
const cfg = brain.sources() as any;
const cache = root + ".cache/";
mkdirSync(cache, { recursive: true });
const statePath = cache + "state.json";
const state: Record<string, string> = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
const argv = process.argv;
const all = argv.includes("--all");
const agentsArg = argv[argv.indexOf("--agents") + 1];
const agents = argv.includes("--agents") && agentsArg ? agentsArg.split(",") : undefined;

const projects = ((cfg.projects ?? []) as ProjectRef[]).filter((p) => p.slug);
const turns = collectTurns({ home, projects, agents, claudeDir: cfg.transcripts_dir ? String(cfg.transcripts_dir) : undefined });

// Incremental: one high-water mark per project and agent. The old per-project key still seeds Claude.
const since = (slug: string, agent: string) => (all ? "" : state[`${slug}@${agent}`] ?? (agent === "claude" ? state[slug] ?? "" : ""));
const latest: Record<string, string> = {};
const fresh = turns.filter((t) => {
  if (t.ts <= since(t.project, t.agent)) return false;
  const k = `${t.project}@${t.agent}`;
  if (!latest[k] || t.ts > latest[k]) latest[k] = t.ts;
  return looksLikeDirective(t.text);
});
Object.assign(state, latest);

// Drop turns already quoted as evidence somewhere.
const known = [...listDocs(root + "inbox"), ...listDocs(root + "decisions"), ...listDocs(root + "patterns")]
  .flatMap((d) => (Array.isArray(d.fm.evidence) ? (d.fm.evidence as string[]) : []))
  .join("\n").toLowerCase();
const unseen = fresh.filter((t) => !known.includes(t.text.slice(0, 60).toLowerCase()));

const byAgent = (list: typeof turns) => [...new Set(list.map((t) => t.agent))].map((a) => `${a} ${list.filter((t) => t.agent === a).length}`).join(", ");
const out = [`# Review queue — ${new Date().toISOString().slice(0, 10)}`, "",
  `${unseen.length} directive-looking turns not yet cited as evidence (${fresh.length} matched, ${all ? "full scan" : "incremental"}; by agent: ${byAgent(fresh) || "none"}).`,
  "Turn each into a candidate in inbox/ (or discard). Keep quotes verbatim.", ""];
for (const p of new Set(unseen.map((t) => t.project))) {
  out.push(`## ${p}`, "");
  for (const t of unseen.filter((t) => t.project === p)) out.push(`- \`transcript:${p}:${t.date}\` (${t.agent} ${t.session}) ${t.text}`);
  out.push("");
}
writeFileSync(root + "inbox/_review-queue.md", out.join("\n"));
writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log(`${unseen.length} new directive-looking turns → inbox/_review-queue.md (${byAgent(fresh) || "no sessions matched a project path"})`);
