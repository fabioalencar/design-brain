// Renders skills/ and exports/ from decisions/ (+ inbox/ with --preview) and patterns/.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { listDocs, section, scopeKind, DIMENSIONS, type Doc, brainRoot, toolRoot } from "./lib";

const root = brainRoot();
const preview = process.argv.includes("--preview");

let decisions = listDocs(root + "decisions").filter((d) => d.fm.status === "confirmed");
if (preview) {
  const cands = listDocs(root + "inbox").filter((d) => d.fm.status === "candidate");
  decisions = decisions.concat(cands);
}
const patterns = listDocs(root + "patterns");
const today = new Date().toISOString().slice(0, 10);
const banner = preview
  ? `> **PREVIEW BUILD ${today}.** Includes UNREVIEWED candidates from inbox/. Not for daily use.\n\n`
  : "";

const byWeight = (a: Doc, b: Doc) =>
  (occ(b) - occ(a)) || ((b.fm.confidence as number) - (a.fm.confidence as number));
const occ = (d: Doc) => (Array.isArray(d.fm.occurrences) ? (d.fm.occurrences as string[]).length : 0);
const tag = (d: Doc) => (d.fm.status === "candidate" ? " _(unreviewed)_" : "");
const firstPara = (s: string) => s.split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim() ?? "";
const stanceWord: Record<string, string> = { always: "Always", never: "Never", prefer: "Prefer", avoid: "Avoid", context: "When it applies" };

function ruleLine(d: Doc): string {
  const title = String(d.fm.title);
  let rule = firstPara(section(d.body, "Rule"));
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!rule || norm(rule).startsWith(norm(title).slice(0, 40)) || norm(title).startsWith(norm(rule).slice(0, 40))) rule = "";
  // DDR-005: no project names, paths, quotes or project-specific examples leave the ledger.
  return `- **${stanceWord[d.fm.stance as string] ?? ""}: ${title}**${tag(d)} (${d.fm.id}, seen in ${occ(d)} project${occ(d) === 1 ? "" : "s"}, conf ${d.fm.confidence}).${rule ? " " + rule : ""}`;
}

function renderDimension(dim: string, docs: Doc[]): string {
  const rows = docs.filter((d) => d.fm.dimension === dim).sort(byWeight);
  if (!rows.length) return "";
  return `### ${dim}\n\n${rows.map(ruleLine).join("\n")}\n\n`;
}

function renderScope(title: string, docs: Doc[], intro: string): string {
  if (!docs.length) return "";
  return `## ${title}\n\n${intro}\n\n${DIMENSIONS.map((dm) => renderDimension(dm, docs)).join("")}`;
}

const kindOf = (d: Doc) => String(d.fm.kind ?? "harvested");
const heuristics = decisions.filter((d) => kindOf(d) === "heuristic").sort(byWeight);
const biases = decisions.filter((d) => kindOf(d) === "bias").sort(byWeight);
const practices = decisions.filter((d) => kindOf(d) === "practice").sort(byWeight);
decisions = decisions.filter((d) => kindOf(d) === "harvested");
const universal = decisions.filter((d) => scopeKind(d.fm.scope) === "universal");
const personal = decisions.filter((d) => scopeKind(d.fm.scope) === "personal");
const clients = new Map<string, Doc[]>();
for (const d of decisions.filter((d) => scopeKind(d.fm.scope) === "client")) {
  const k = (d.fm.scope as string).slice(7);
  clients.set(k, [...(clients.get(k) ?? []), d]);
}
const projects = decisions.filter((d) => scopeKind(d.fm.scope) === "project");

// ---------- skill 1: design-brain (context) ----------
const mainDesc =
  "The designer's standing design decisions, compiled from their past projects. Use this skill whenever a task touches UI, layout, landing pages, heroes, sections, components, typography, fonts, color, tokens, spacing, motion, or UX copy, even if the user only says 'make it look better', 'design this', 'build a page', or 'it looks generic'. Load it before proposing any visual direction so the defaults and known rejections are applied without being re-told.";

let main = `---
name: design-brain
description: ${JSON.stringify(mainDesc)}
---

# design-brain

${banner}Standing decisions distilled from the designer's own projects. Each line is a rule with
a stance, an id, how many projects it was observed in, and the designer's confidence. Ask before
overriding an **Always**/**Never**; **Prefer**/**Avoid** are defaults you may deviate
from with a stated reason.

**First, establish scope.** If the project is a client brand (see
\`~/Code/design-brain/sources.yaml\`), apply only *Universal* rules plus that client's
section. Otherwise apply *Universal* + *Personal*.

When you apply a rule, say so once: \`applied DB-###\`. When you deliberately deviate,
say \`deviating from DB-###: <reason>\`. When the designer corrects something not covered here,
suggest recording it: \`bun run harvest\` or a note in \`~/Code/design-brain/inbox/\`.

${renderScope("Universal craft", universal, "Applies to every project.")}${renderScope("Personal taste", personal, "The designer's own defaults. Applies to their brands and unbranded work.")}`;
for (const [k, docs] of clients) main += renderScope(`Client: ${k}`, docs, `Only when working on ${k}.`);
if (projects.length) main += renderScope("Project-specific", projects, "Only inside the named project.");
if (heuristics.length) main += `## Reference heuristics\n\nEstablished usability heuristics the designer has adopted as standing checks. Apply them as a\nreview pass, not as a style.\n\n${heuristics.map(ruleLine).join("\n")}\n\n`;
if (biases.length) main += `## Biases and manipulative patterns to avoid\n\nKnown cognitive biases the interface must not exploit, and biases the designer must not\nfall into. Each is a **Never** unless the entry says otherwise.\n\n${biases.map(ruleLine).join("\n")}\n\n`;
if (practices.length) {
  main += `## Component practices\n\nGood practice per common component or use case, adopted by the designer. Apply the\nrelevant group when the task touches that component.\n\n`;
  for (const comp of [...new Set(practices.map((d) => String(d.fm.component)))].sort()) {
    main += `### ${comp}\n\n${practices.filter((d) => d.fm.component === comp).map(ruleLine).join("\n")}\n\n`;
  }
}
main += `## Reference inventory

Facts (not rules) about fonts, palettes, tokens and components per project live in
\`~/Code/design-brain/inventory/\`. Read \`palettes.md\` and \`fonts.md\` when picking a
direction so new work rhymes with existing work instead of restarting from zero.
`;
writeSkill("design-brain", main);

// ---------- skill 2: design-brain-check (detect) ----------
const checkDesc =
  "Scan a page, screenshot, component, or diff for the designer's known design failure patterns and name them. Use whenever asked to review, critique, QA, or 'check' a UI, whenever the user says something looks generic, sloppy, 'AI', or 'off', and before declaring any UI work done. Names the pattern, quotes the evidence, gives the fix in a few words. Does not score.";
const anti = patterns.filter((p) => p.fm.kind === "anti-slop").sort(byWeight);
const craft = patterns.filter((p) => p.fm.kind === "craft").sort(byWeight);
const patLine = (p: Doc) => {
  const looks = (p.body.match(/\*\*Looks like:\*\*\s*([\s\S]*?)(?=\n\s*\n|\*\*Fix)/)?.[1] ?? "").replace(/\s+/g, " ").trim();
  const fix = (p.body.match(/\*\*Fix:\*\*\s*([\s\S]*?)(?=\n\s*\n|\*\*Seen|$)/)?.[1] ?? "").replace(/\s+/g, " ").trim();
  return `- **${p.fm.title}** (${p.fm.scope}, seen in ${occ(p)} project${occ(p) === 1 ? "" : "s"})\n  - Looks like: ${looks}\n  - Fix: ${fix}`;
};
const biasLines = biases.map((b) => `- **${b.fm.title}** (${b.fm.id}) — ${firstPara(section(b.body, "Rule")).slice(0, 220)}`).join("\n");
let check = `---
name: design-brain-check
description: ${JSON.stringify(checkDesc)}
---

# design-brain-check

${banner}Detect mode. For the surface under review, walk the patterns below. For each hit:
name the pattern, quote or point at the exact element, give the fix in one line. Do
not rate, do not pad with praise, do not report patterns that are not present. If a
"hit" is something the designer chose on purpose (a decision in \`design-brain\` covers it),
say so instead of flagging it.

Output shape:

\`\`\`
[pattern name] — <where> — <fix>
\`\`\`

## Anti-slop patterns (things that keep needing fixing)

${anti.map(patLine).join("\n")}

## Biases and manipulative patterns (flag on sight)

${biasLines || "_none confirmed yet_"}

## Craft patterns (things that should be present)

Check these are used where the situation calls for them.

${craft.map(patLine).join("\n")}
`;
writeSkill("design-brain-check", check);

// ---------- skill 3: design-brain-start (kickoff) ----------
const startDesc =
  "Kick off design for a new project, page, screen, or redesign using the designer's recorded defaults. Use when the user starts a new site, app, landing page, prototype, or 'direction', asks for a design system, tokens, font pairing, palette, or says 'let's start the design'. Establishes scope (personal vs client), picks a starting direction from past work, and lists the non-negotiables before any code.";
const hard = decisions.filter((d) => ["always", "never"].includes(d.fm.stance as string) && scopeKind(d.fm.scope) !== "client" && (occ(d) >= 2 || (d.fm.confidence as number) >= 8)).sort(byWeight);
const inv = (name: string) => (existsSync(root + "inventory/" + name) ? `- \`~/Code/design-brain/inventory/${name}\`` : "");
let start = `---
name: design-brain-start
description: ${JSON.stringify(startDesc)}
---

# design-brain-start

${banner}## 1. Scope

Ask (or infer from the repo) one question: **personal brand or client brand?** Client
work takes only universal craft plus the client's constraints; do not import personal
taste. Record the answer in the project's CLAUDE.md.

## 2. Start from what exists

Read the inventory before proposing anything, so the new direction rhymes with prior
work instead of starting blank:

${[inv("fonts.md"), inv("palettes.md"), inv("tokens.md"), inv("components.md"), inv("audits.md")].filter(Boolean).join("\n")}

Propose 2–3 directions, each naming which decisions it applies. The designer compares
directions side by side; never retire a direction until they approve the one to keep.

## 3. Non-negotiables

${hard.map(ruleLine).join("\n") || "_none confirmed yet_"}

## 4. Then load \`design-brain\` for the full rule set and \`design-brain-check\` before calling anything done.
`;
writeSkill("design-brain-start", start);

// ---------- exports ----------
mkdirSync(root + "exports", { recursive: true });
const dimMap: Record<string, string> = { typography: "fonts", color: "colors", layout: "layouts", spacing: "layouts" };
const profile: any = { schema: 1, generated: today, source: "design-brain", dimensions: { fonts: { approved: [], rejected: [] }, colors: { approved: [], rejected: [] }, layouts: { approved: [], rejected: [] }, aesthetics: { approved: [], rejected: [] } } };
for (const d of decisions.filter((d) => scopeKind(d.fm.scope) !== "client")) {
  const dim = dimMap[d.fm.dimension as string] ?? "aesthetics";
  const bucket = ["never", "avoid"].includes(d.fm.stance as string) ? "rejected" : "approved";
  profile.dimensions[dim][bucket].push({ value: d.fm.title, id: d.fm.id, confidence: (d.fm.confidence as number) / 10, approved_count: bucket === "approved" ? occ(d) : 0, rejected_count: bucket === "rejected" ? occ(d) : 0, last_seen: String(d.fm.last_seen ?? today), status: d.fm.status });
}
writeFileSync(root + "exports/taste-profile.json", JSON.stringify(profile, null, 2));

const learnings = decisions.map((d) => JSON.stringify({ skill: "design-brain", type: "preference", key: String(d.fm.id).toLowerCase() + "-" + d.file.replace(/^DB-(c-)?\d+-/, "").replace(/\.md$/, ""), insight: `${d.fm.title}: ${firstPara(section(d.body, "Rule"))}`, confidence: d.fm.confidence, source: "user-stated", scope: d.fm.scope, ts: today + "T00:00:00.000Z", trusted: d.fm.status === "confirmed" })).join("\n");
writeFileSync(root + "exports/learnings.jsonl", learnings + (learnings ? "\n" : ""));

writeFileSync(root + "exports/CLAUDE-snippet.md", `## Design decisions

This project follows the designer's standing design decisions. Load the \`design-brain\` skill
before any UI work and run \`design-brain-check\` before declaring UI done.
Scope: **<personal | client:name>**. New non-obvious design choices get a note in
\`~/Code/design-brain/inbox/\` (or a Forge DDR if this repo has a record).
`);

// DDR-005 guard: no project slug, alias, or client name may appear in compiled skills.
{
  const cfg = parseYaml(readFileSync(root + "sources.yaml", "utf8"));
  const names = new Set<string>();
  for (const p of cfg.projects as any[]) { names.add(String(p.slug)); for (const a of p.aliases ?? []) names.add(String(a)); if (String(p.scope).startsWith("client:")) names.add(String(p.scope).slice(7)); }
  for (const n of ["forge", "own-product-b", "own-product-c", "studio-a", "client-e", "client-e", "own-product-a", "own-product-d", "own-product-e", "client-a", "client-b", "client-c", "client-d", "solea", "promptrank", "fabio"]) names.add(n);
  const re = new RegExp(`\\b(${[...names].map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "i");
  let leaks = 0;
  for (const name of ["design-brain", "design-brain-check", "design-brain-start"]) {
    const lines = readFileSync(`${root}skills/${name}/SKILL.md`, "utf8").split("\n");
    lines.forEach((l, i) => { if (l.startsWith("- ") && re.test(l)) { leaks++; console.log(`leak  skills/${name}/SKILL.md:${i + 1}: ${l.slice(0, 120)}`); } });
  }
  if (leaks) console.log(`DDR-005: ${leaks} line(s) in skills/ name a project. Fix the rule text in the ledger.`);
}
console.log(`compiled ${decisions.length} harvested + ${heuristics.length} heuristics + ${biases.length} biases + ${practices.length} practices (${preview ? "preview incl. inbox" : "confirmed only"}), ${patterns.length} patterns → skills/, exports/`);

function writeSkill(name: string, content: string) {
  mkdirSync(`${root}skills/${name}`, { recursive: true });
  writeFileSync(`${root}skills/${name}/SKILL.md`, content);
}
