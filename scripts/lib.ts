import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";

/** Directory of the tool itself (scripts/, templates/, seed/). */
export const toolRoot = new URL("..", import.meta.url).pathname;

import { parse as parseYaml } from "yaml";

export type Frontmatter = Record<string, unknown>;
export interface Doc {
  path: string;
  file: string;
  fm: Frontmatter;
  body: string;
}

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseDoc(path: string): Doc {
  const raw = readFileSync(path, "utf8");
  const m = raw.match(FM_RE);
  if (!m) throw new Error(`${path}: missing frontmatter`);
  const fm = (parseYaml(m[1]) ?? {}) as Frontmatter;
  return { path, file: basename(path), fm, body: m[2].trim() };
}

export function listDocs(dir: string): Doc[] {
  let names: string[] = [];
  try {
    names = readdirSync(dir).filter((n) => n.endsWith(".md") && !n.startsWith("_"));
  } catch {
    return [];
  }
  return names
    .map((n) => join(dir, n))
    .filter((p) => statSync(p).isFile())
    .sort()
    .map(parseDoc);
}

export function section(body: string, heading: string): string {
  const parts = body.split(/^(?=##\s)/m);
  const p = parts.find((x) => new RegExp(`^##\\s+${heading}\\b`).test(x));
  return p ? p.replace(/^##[^\n]*\n?/, "").trim() : "";
}

export const DIMENSIONS = ["typography","color","spacing","layout","motion","copy","components","process","anti-slop"] as const;
export const STANCES = ["always","never","prefer","avoid","context"] as const;
export const STATUSES = ["candidate","confirmed","retired"] as const;
export const KINDS = ["harvested","heuristic","bias","practice"] as const;
export const SECTIONS = ["Rule","Why","Examples","Exceptions","Review notes"] as const;
export const COMPONENTS = ["notifications","user-profile","settings","tooltips","search","data-tables","sorting","filtering","highlight-cards","progressive-disclosure","modals","drawers","details-page","forms","empty-states","navigation","onboarding"] as const;

export function scopeKind(scope: unknown): "universal" | "personal" | "client" | "project" | "invalid" {
  if (scope === "universal" || scope === "personal") return scope;
  if (typeof scope === "string" && /^client:[a-z0-9-]+$/.test(scope)) return "client";
  if (typeof scope === "string" && /^project:[a-z0-9-]+$/.test(scope)) return "project";
  return "invalid";
}

/** Paragraphs in ## Rule / ## Why longer than PARA_MAX chars (about five rows on the review card). */
export const PARA_MAX = 300;
export function longParagraphs(body: string): { section: string; chars: number }[] {
  const out: { section: string; chars: number }[] = [];
  for (const name of ["Rule", "Why"]) {
    for (const para of section(body, name).split(/\n\s*\n/)) {
      const t = para.trim();
      if (t && !/^[-*]\s/.test(t) && t.length > PARA_MAX) out.push({ section: name, chars: t.length });
    }
  }
  return out;
}

/** conflicts_with ids on a doc, normalised to an array of strings. */
export function conflictsOf(d: Doc): string[] {
  const v = d.fm.conflicts_with;
  return Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? [v] : [];
}
/** Pairs of confirmed decisions that conflict and carry no resolution on either side. */
export function unresolvedConflicts(decisions: Doc[]): { a: Doc; b: Doc }[] {
  const byId = new Map(decisions.map((d) => [String(d.fm.id), d]));
  const out: { a: Doc; b: Doc }[] = [];
  // A conflict is declared on one side only, so pair on the ids rather than on who declared it,
  // and dedupe on the pair so a mutual declaration is still reported once.
  const seen = new Set<string>();
  for (const a of decisions) for (const id of conflictsOf(a)) {
    const b = byId.get(id);
    if (!b || b === a || a.fm.resolution || b.fm.resolution) continue;
    const pair = [String(a.fm.id), id].sort().join(" ");
    if (seen.has(pair)) continue;
    seen.add(pair);
    out.push({ a, b });
  }
  return out;
}

/** Evidence lines are `type:ref "quote"`. One grammar, one parser, one label vocabulary. */
export const EVIDENCE_LABELS: Record<string, string> = {
  transcript: "said", repo: "repo", ddr: "DDR", audit: "audit",
  commit: "commit", note: "note", reference: "source", learnings: "learning",
};
export interface Evidence { type: string; label: string; ref: string; quote: string; url?: string }
export function parseEvidence(line: string): Evidence | null {
  const m = String(line).match(/^([a-z]+):([^"]*?)\s*(?:"([\s\S]*)")?\s*$/i);
  if (!m) return null;
  const type = m[1].toLowerCase();
  const ref = (m[2] ?? "").trim();
  const url = ref.match(/https?:\/\/[^\s]+/)?.[0];
  return { type, label: EVIDENCE_LABELS[type] ?? type, ref, quote: m[3] ?? "", url };
}
