// Reads a project's decision records (DDRs) into one shape, whichever of the two formats the
// project uses, and turns the accepted ones into staged candidates. Pure: paths in, objects out.
// Nothing here writes; harvest-ddrs.ts decides where the results go.
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parse as parseYaml } from "yaml";
import { section, type Doc } from "./lib";
import { TITLE_MAX, type NewCandidate } from "./ledger";

export interface Ddr {
  id: string;
  number: number;
  file: string;
  path: string;
  title: string;
  /** Lower-cased; `accepted` is the only one a harvest keeps. */
  status: string;
  date: string;
  decision: string;
  why: string;
}

/** A project entry from sources.yaml, as far as this harvester reads it. */
export interface DdrProject { slug: string; path: string; scope: string; ddr_dir: string }

/** A candidate as far as a script can fill it. `dimension` and `stance` are left empty on
 *  purpose: they are judgment, not extraction. Underscored fields are for the queue, ignored by `add`. */
export type Staged = NewCandidate & { _ddr: string; _date: string; _warnings: string[] };

/** One staged item: the source decision and what the agent still owes. */
export interface StagedDdr { ddr: Ddr; project: string; candidate: Staged }

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
// The pre-format shape: `# DDR-003 — Title` then `- **Status**: accepted` bullets.
const HEAD_RE = /^#\s+(DDR-\d{3})\s+[—–-]+\s*(.+)$/m;
const DDR_FILE = /^DDR-\d{3}-.*\.md$/;

/** First paragraph of a section, markdown emphasis stripped, whitespace collapsed. */
export function firstParagraph(text: string): string {
  const para = text.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !/^[-*]\s/.test(p)) ?? "";
  return para.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\s+/g, " ").trim();
}

/** The first sentence, for the evidence quote. Double quotes would break the evidence grammar. */
export function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).replace(/"/g, "'").trim();
}

export function parseDdr(path: string): Ddr | null {
  const raw = readFileSync(path, "utf8");
  const m = raw.match(FM_RE);
  let id = "", title = "", status = "", date = "", body = raw;
  if (m) {
    const fm = (parseYaml(m[1]) ?? {}) as Record<string, unknown>;
    id = String(fm.id ?? "");
    title = String(fm.title ?? "");
    status = String(fm.decision_status ?? fm.status ?? "");
    date = String(fm.date ?? "");
    body = m[2];
  } else {
    const h = raw.match(HEAD_RE);
    if (!h) return null;
    id = h[1];
    title = h[2].trim();
    status = raw.match(/^\s*-\s*\*\*Status\*\*\s*:\s*([a-z]+)/im)?.[1] ?? "";
    date = raw.match(/^\s*-\s*\*\*Date\*\*\s*:\s*(\S+)/im)?.[1] ?? "";
  }
  const num = id.match(/^DDR-(\d{3})$/)?.[1];
  if (!num) return null;
  return {
    id, number: Number(num), file: basename(path), path, title: title.trim(), status: status.trim().toLowerCase(), date: date.trim(),
    decision: firstParagraph(section(body, "Decision")),
    why: firstParagraph(section(body, "Why")),
  };
}

/** Every DDR file in a directory, in id order. Unparseable files are skipped, not fatal. */
export function listDdrs(dir: string): Ddr[] {
  let names: string[] = [];
  try { names = readdirSync(dir).filter((n) => DDR_FILE.test(n)); } catch { return []; }
  const out: Ddr[] = [];
  for (const n of names.sort()) {
    try { const d = parseDdr(join(dir, n)); if (d) out.push(d); } catch { /* reported by the caller's count, not fatal */ }
  }
  return out;
}

/** Basenames of every DDR the brain already cites, so a moved repo does not make old evidence look new. */
export function citedDdrFiles(docs: Doc[]): Set<string> {
  const out = new Set<string>();
  for (const d of docs) {
    const ev = Array.isArray(d.fm.evidence) ? (d.fm.evidence as unknown[]) : [];
    for (const line of ev) {
      const m = String(line).match(/^ddr:\s*([^"\s]+)/i);
      if (m) out.add(basename(m[1]));
    }
  }
  return out;
}

/** Projects a harvest may read: they name a ddr_dir and a scope. Scope is what the candidate inherits. */
export function ddrProjects(projects: Record<string, unknown>[]): { ok: DdrProject[]; skipped: { slug: string; why: string }[] } {
  const ok: DdrProject[] = [], skipped: { slug: string; why: string }[] = [];
  for (const p of projects) {
    const slug = String(p.slug ?? "");
    if (!slug || !p.ddr_dir) continue;
    if (!p.path || p.path === "external") { skipped.push({ slug, why: "no local path" }); continue; }
    if (!p.scope) { skipped.push({ slug, why: "no scope; a harvest never guesses one" }); continue; }
    ok.push({ slug, path: String(p.path), scope: String(p.scope), ddr_dir: String(p.ddr_dir) });
  }
  return { ok, skipped };
}

export function stageDdr(ddr: Ddr, project: DdrProject): StagedDdr {
  const warnings: string[] = [];
  if (ddr.title.length > TITLE_MAX) warnings.push(`title is ${ddr.title.length} chars; shorten to ${TITLE_MAX}`);
  if (!ddr.decision) warnings.push("no Decision section; write the rule by hand");
  const ref = `${project.path.replace(/\/$/, "")}/${project.ddr_dir.replace(/^\/|\/$/g, "")}/${ddr.file}`;
  const quote = firstSentence(ddr.decision || ddr.title);
  return {
    ddr, project: project.slug,
    candidate: {
      title: ddr.title, dimension: "", stance: "", kind: "harvested", scope: project.scope, source: "forge record",
      occurrences: [project.slug], evidence: [`ddr:${ref} "${quote}"`],
      rule: ddr.decision, why: ddr.why,
      _ddr: ddr.id, _date: ddr.date, _warnings: warnings,
    },
  };
}
