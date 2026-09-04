// Validates frontmatter of inbox/, decisions/, patterns/. Exit 1 on any error.
import { listDocs, scopeKind, longParagraphs, conflictsOf, unresolvedConflicts, DIMENSIONS, STANCES, STATUSES, KINDS, COMPONENTS, brainRoot, toolRoot } from "./lib";

const TITLE_MAX = 80; // two lines at the review card width; detail goes in ## Rule
const errors: string[] = [];
const warn: string[] = [];
const root = brainRoot();

function need(cond: unknown, msg: string) { if (!cond) errors.push(msg); }

const ids = new Map<string, string>();
for (const dir of ["inbox", "decisions"]) {
  for (const d of listDocs(root + dir)) {
    const f = `${dir}/${d.file}`;
    const fm = d.fm;
    need(typeof fm.id === "string" && /^DB-(c-)?\d{3}$/.test(fm.id as string), `${f}: id must be DB-###/DB-c-###`);
    if (typeof fm.id === "string") {
      if (ids.has(fm.id)) errors.push(`${f}: duplicate id ${fm.id} (also ${ids.get(fm.id)})`);
      ids.set(fm.id, f);
    }
    need(typeof fm.title === "string" && (fm.title as string).length > 8, `${f}: title missing`);
    if (typeof fm.title === "string" && (fm.title as string).length > TITLE_MAX) errors.push(`${f}: title is ${(fm.title as string).length} chars; max ${TITLE_MAX} (two lines). Move detail into ## Rule.`);
    need(DIMENSIONS.includes(fm.dimension as any), `${f}: dimension invalid (${fm.dimension})`);
    need(scopeKind(fm.scope) !== "invalid", `${f}: scope invalid (${fm.scope})`);
    need(STANCES.includes(fm.stance as any), `${f}: stance invalid (${fm.stance})`);
    need(STATUSES.includes(fm.status as any), `${f}: status invalid (${fm.status})`);
    need(fm.kind === undefined || KINDS.includes(fm.kind as any), `${f}: kind invalid (${fm.kind})`);
    if (fm.kind === "practice") { need(COMPONENTS.includes(fm.component as any), `${f}: practice needs a component from lib.ts COMPONENTS (${fm.component})`); }
    if (fm.kind === "heuristic" || fm.kind === "bias" || fm.kind === "practice") need(Array.isArray(fm.evidence) && (fm.evidence as string[]).some((e) => /^reference:/.test(e)), `${f}: ${fm.kind} needs a reference: evidence line`);
    if (dir === "inbox") need(fm.status !== "confirmed", `${f}: inbox file cannot be confirmed`);
    if (dir === "decisions") need(fm.status === "confirmed", `${f}: decisions/ file must be confirmed`);
    need(typeof fm.confidence === "number" && fm.confidence >= 1 && fm.confidence <= 10, `${f}: confidence 1-10`);
    need(Array.isArray(fm.evidence) && (fm.evidence as unknown[]).length > 0, `${f}: evidence required`);
    need(Array.isArray(fm.occurrences) && (fm.occurrences as unknown[]).length > 0, `${f}: occurrences required`);
    if (!/^##\s+Rule/m.test(d.body)) errors.push(`${f}: missing '## Rule'`);
    for (const c of conflictsOf(d)) need(/^DB-(c-)?\d{3}$/.test(c), `${f}: conflicts_with entry '${c}' is not an id`);
    if (conflictsOf(d).length && !d.fm.resolution && dir === "inbox") warn.push(`${f}: conflicts with ${conflictsOf(d).join(", ")} and has no resolution yet`);
    for (const p of longParagraphs(d.body)) warn.push(`${f}: ${p.section} paragraph is ${p.chars} chars (~${Math.ceil(p.chars / 62)} rows); max ~300 (5 rows). Split by idea or move detail to Examples.`);
    if (!/^##\s+Why/m.test(d.body)) warn.push(`${f}: missing '## Why'`);
    if (fm.scope === "personal" && Array.isArray(fm.occurrences)) {
      // client-only occurrence lists cannot be personal
      const occ = fm.occurrences as string[];
      const clientOnly = ["client-a","client-b","client-c","client-d","client-e","client-e-programme","client-e-contracts","client-e-app","client-f"];
      if (occ.length > 0 && occ.every((o) => clientOnly.includes(o))) errors.push(`${f}: personal scope but only client occurrences`);
    }
  }
}
for (const { a, b } of unresolvedConflicts(listDocs(root + "decisions"))) errors.push(`decisions/${a.file} and decisions/${b.file} are both confirmed, marked as conflicting, and neither carries a resolution`);
for (const d of listDocs(root + "patterns")) {
  const f = `patterns/${d.file}`;
  need(d.fm.type === "pattern", `${f}: type must be pattern`);
  need(["anti-slop","craft"].includes(d.fm.kind as string), `${f}: kind must be anti-slop|craft`);
  need(typeof d.fm.title === "string", `${f}: title missing`);
  if (typeof d.fm.title === "string" && (d.fm.title as string).length > TITLE_MAX) errors.push(`${f}: title is ${(d.fm.title as string).length} chars; max ${TITLE_MAX}`);
  need(["universal","personal"].includes(d.fm.scope as string), `${f}: scope must be universal|personal`);
  need(/\*\*Looks like:\*\*/.test(d.body), `${f}: missing **Looks like:**`);
  need(/\*\*Fix:\*\*/.test(d.body), `${f}: missing **Fix:**`);
}
for (const w of warn) console.log("warn  " + w);
for (const e of errors) console.log("error " + e);
console.log(`${ids.size} decisions/candidates, ${listDocs(root + "patterns").length} patterns, ${errors.length} errors, ${warn.length} warnings`);
process.exit(errors.length ? 1 : 0);
