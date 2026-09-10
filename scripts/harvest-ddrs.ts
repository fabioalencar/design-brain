// Reads accepted decision records (DDRs) out of every project whose sources.yaml entry declares
// ddr_dir, skips the ones the brain already cites as evidence, and stages the rest for review:
// a readable queue in inbox/_ddr-queue.md and the same items as candidate JSON in
// .cache/ddr-queue.json, missing only the two judgment fields (dimension, stance) the agent
// fills before `design-brain add`. Nothing lands in inbox/ as a candidate from here.
// Re-runnable: remembers the highest DDR number per project in .cache/state.json; --all rescans.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { expandHome, openBrainOrExit } from "./brain";
import { citedDdrFiles, ddrProjects, listDdrs, stageDdr, type Staged, type StagedDdr } from "./ddrs";
import { listDocs } from "./lib";
import { TITLE_MAX } from "./ledger";

const brain = openBrainOrExit();
const root = brain.root;
const cfg = brain.sources();
const cache = root + ".cache/";
mkdirSync(cache, { recursive: true });
const statePath = cache + "state.json";
const state: Record<string, string> = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
const all = process.argv.includes("--all");

const { ok: projects, skipped } = ddrProjects((cfg.projects ?? []) as Record<string, unknown>[]);
for (const s of skipped) console.log(`skip ${s.slug}: ${s.why}`);

const cited = citedDdrFiles([...listDocs(root + "inbox"), ...listDocs(root + "decisions"), ...listDocs(root + "patterns")]);
const key = (slug: string) => `${slug}@ddr`;
const seenUpTo = (slug: string) => (all ? 0 : Number(state[key(slug)]?.match(/\d+$/)?.[0] ?? 0));

const staged: StagedDdr[] = [];
let scanned = 0, notAccepted = 0, alreadyCited = 0;
for (const p of projects) {
  const dir = `${expandHome(p.path)}/${p.ddr_dir}`;
  if (!existsSync(dir)) { console.log(`skip ${p.slug}: ${dir} missing`); continue; }
  const ddrs = listDdrs(dir);
  scanned += ddrs.length;
  let high = seenUpTo(p.slug);
  for (const d of ddrs) {
    if (d.number === 0) continue; // DDR-000 is the template by convention, never a decision
    if (d.number > high) high = d.number;
    if (d.number <= seenUpTo(p.slug)) continue;
    if (d.status !== "accepted") { notAccepted++; continue; }
    if (cited.has(d.file)) { alreadyCited++; continue; }
    staged.push(stageDdr(d, p));
  }
  if (ddrs.length) state[key(p.slug)] = `DDR-${String(high).padStart(3, "0")}`;
}

// The queue is the set of pending items, not the last run's output: entries from earlier runs stay
// until the brain cites their DDR, and a rerun with nothing new leaves them alone.
const queuePath = cache + "ddr-queue.json";
const previous: Staged[] = existsSync(queuePath) ? JSON.parse(readFileSync(queuePath, "utf8")) : [];
const refOf = (c: Staged) => c.evidence[0].replace(/^ddr:\s*/, "").replace(/\s*"[^"]*"$/, "");
const fresh = staged.map((s) => s.candidate);
const freshRefs = new Set(fresh.map(refOf));
const pending = previous.filter((c) => !cited.has(basename(refOf(c))) && !freshRefs.has(refOf(c)));
const queue = [...pending, ...fresh].sort((a, b) => a.occurrences[0].localeCompare(b.occurrences[0]) || a._ddr.localeCompare(b._ddr));

const today = new Date().toISOString().slice(0, 10);
const slugs = [...new Set(queue.map((c) => c.occurrences[0]))];
const out = [`# DDR queue — ${today}`, "",
  `${queue.length} accepted decisions not yet cited as evidence: ${fresh.length} new this run (${scanned} scanned across ${projects.length} project${projects.length === 1 ? "" : "s"}, ${all ? "full scan" : "incremental"}; ${notAccepted} not accepted, ${alreadyCited} already cited), ${pending.length} pending from earlier runs.`,
  "",
  "Each entry is also in `.cache/ddr-queue.json` as a candidate missing `dimension` and `stance`.",
  "Fill those two for the ones worth keeping, drop the rest, then `design-brain add .cache/ddr-queue.json`.",
  `Titles over ${TITLE_MAX} characters must be shortened first; the rule body keeps the detail.`, ""];
for (const slug of slugs) {
  const mine = queue.filter((c) => c.occurrences[0] === slug);
  out.push(`## ${slug} (${mine[0].scope})`, "");
  for (const c of mine) {
    out.push(`- **${c._ddr}** ${c.title}${c._date ? ` — ${c._date}` : ""}`);
    out.push(`  \`ddr:${refOf(c)}\``);
    if (c.rule) out.push(`  Decision: ${c.rule}`);
    if (c.why) out.push(`  Why: ${c.why}`);
    for (const w of c._warnings) out.push(`  ⚠ ${w}`);
  }
  out.push("");
}
writeFileSync(root + "inbox/_ddr-queue.md", out.join("\n"));
writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n");
writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log(`${fresh.length} accepted DDRs staged, ${queue.length} pending → inbox/_ddr-queue.md and .cache/ddr-queue.json (${scanned} scanned, ${alreadyCited} already cited, ${notAccepted} not accepted)`);
