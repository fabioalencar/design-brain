// Every mutation of a brain's ledger goes through here. Callers name a transition; this module
// owns frontmatter serialisation, id allocation, file naming and the inbox/decisions layout.
// Nothing outside it may write a decision file.
import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import type { Brain } from "./brain";
import { parseDoc, type Doc } from "./lib";

export const ID_RE = /^DB-(c-)?\d{3}$/;
const CANDIDATE_PREFIX = /^DB-c-\d{3}-/;
const CONFIRMED_PREFIX = /^DB-(\d{3})-/;
const FM_SPLIT = /^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n?)([\s\S]*)$/;

export type FieldValue = string | number | string[] | null;

/** YAML scalar that survives a round trip. Quotes anything that could be read as something else. */
export function yamlValue(v: FieldValue): string {
  if (v === null) return "";
  if (Array.isArray(v)) return `[${v.map((x) => yamlValue(String(x))).join(", ")}]`;
  if (typeof v === "number") return String(v);
  const s = String(v);
  const safe = /^[A-Za-z0-9][A-Za-z0-9 _.\/@+-]*$/.test(s)
    && !/^(y|Y|yes|Yes|YES|n|N|no|No|NO|true|True|TRUE|false|False|FALSE|on|On|ON|off|Off|OFF|null|Null|NULL)$/.test(s)
    && !/^\d+(\.\d+)?$/.test(s);
  return safe ? s : JSON.stringify(s);
}

/**
 * Set or remove top-level frontmatter fields. Operates only inside the frontmatter block, so a
 * body line starting `status:` is left alone, and preserves the file's own line endings.
 * Scalar and inline-list fields only; never use it on a field with indented children.
 */
export function setFields(src: string, patch: Record<string, FieldValue>): string {
  const m = src.match(FM_SPLIT);
  if (!m) throw new Error("missing frontmatter");
  const [, open, block, close, body] = m;
  const nl = open.includes("\r\n") ? "\r\n" : "\n";
  const lines = block.split(/\r?\n/);
  for (const [key, value] of Object.entries(patch)) {
    const i = lines.findIndex((l) => l.startsWith(key + ":"));
    // a block-form value carries indented children; they belong to the key being replaced
    let span = 0;
    if (i >= 0) while (lines[i + 1 + span] !== undefined && /^\s+\S/.test(lines[i + 1 + span])) span++;
    if (value === null) {
      if (i >= 0) lines.splice(i, 1 + span);
      continue;
    }
    const line = `${key}: ${yamlValue(value)}`;
    if (i >= 0) lines.splice(i, 1 + span, line);
    else lines.push(line);
  }
  return open + lines.join(nl) + close + body;
}

/** Append a dated line under `## Review notes`, creating the section when it is missing. */
export function addNote(src: string, note: string, today: string): string {
  const n = note.trim();
  if (!n) return src;
  const line = `- ${today}: ${n.replace(/\s*\n\s*/g, " ")}`;
  return /^## Review notes/m.test(src)
    ? src.replace(/(^## Review notes[^\n]*\n\n?)/m, `$1${line}\n`)
    : src.trimEnd() + `\n\n## Review notes\n\n${line}\n`;
}

export interface Edits {
  stance?: string;
  scope?: string;
  confidence?: number;
  title?: string;
  conflicts_with?: string[];
  resolution?: string;
  note?: string;
}

/** A candidate staged by an agent, before the ledger gives it an id and a file. */
export interface NewCandidate {
  title: string;
  dimension: string;
  stance: string;
  confidence: number;
  kind?: "harvested" | "heuristic" | "bias" | "practice";
  component?: string;
  scope?: string;
  source?: string;
  occurrences?: string[];
  evidence: string[];
  rule: string;
  why?: string;
  examples?: string;
  exceptions?: string;
}

export const TITLE_MAX = 80;
/** Hand-added sources live in their own band, so provenance is visible in the id as well as the field. */
export const ADDED_RANGE = 800;

export interface Ledger {
  /** Every candidate and decision, inbox first. */
  all(): Doc[];
  candidates(): Doc[];
  confirmed(): Doc[];
  retired(): Doc[];
  get(id: string): Doc;
  nextConfirmedId(): string;
  /** The next free DB-c-### in a hundred-band, counting promoted ids too so none is reused. */
  nextCandidateId(range?: number): string;
  /** Write a new candidate. Never confirmed: the reviewer still decides. */
  add(c: NewCandidate, range?: number): { id: string; file: string };
  promote(id: string, edits?: Edits): { id: string; file: string };
  retire(id: string, edits?: Edits): void;
  /** Confirmed → back in review, retired → back in review. */
  restore(id: string): { id: string };
  edit(id: string, edits: Edits): void;
  note(id: string, text: string): void;
}

export function openLedger(brain: Brain, today: () => string = () => new Date().toISOString().slice(0, 10)): Ledger {
  const listIn = (dir: string): Doc[] => {
    let names: string[] = [];
    try {
      names = readdirSync(dir).filter((n) => n.endsWith(".md") && !n.startsWith("_"));
    } catch {
      return [];
    }
    const out: Doc[] = [];
    for (const n of names.sort()) {
      try {
        out.push(parseDoc(dir + "/" + n));
      } catch {
        // reported by check.ts; a bad file must not stop the queue
      }
    }
    return out;
  };
  const fileFor = (dir: string, id: string) => {
    const f = readdirSync(dir).find((n) => n.startsWith(id + "-") && n.endsWith(".md"));
    return f ? dir + "/" + f : null;
  };
  const locate = (id: string): { path: string; where: "inbox" | "decisions" } => {
    const i = fileFor(brain.inbox, id);
    if (i) return { path: i, where: "inbox" };
    const d = fileFor(brain.decisions, id);
    if (d) return { path: d, where: "decisions" };
    throw new Error(`no file for ${id}`);
  };
  const applyEdits = (src: string, e?: Edits): string => {
    if (!e) return src;
    const patch: Record<string, FieldValue> = {};
    if (e.stance) patch.stance = e.stance;
    if (e.scope) patch.scope = e.scope;
    if (e.confidence) patch.confidence = e.confidence;
    if (e.title) patch.title = e.title;
    if (e.conflicts_with !== undefined) {
      const ids = e.conflicts_with.filter(Boolean);
      patch.conflicts_with = ids.length ? ids : null;
    }
    if (e.resolution !== undefined) patch.resolution = e.resolution.trim() || null;
    let out = setFields(src, patch);
    if (e.note) out = addNote(out, e.note, today());
    return out;
  };

  return {
    all: () => [...listIn(brain.inbox), ...listIn(brain.decisions)],
    candidates: () => listIn(brain.inbox).filter((d) => d.fm.status === "candidate"),
    confirmed: () => listIn(brain.decisions),
    retired: () => listIn(brain.inbox).filter((d) => d.fm.status === "retired"),

    get(id) {
      return parseDoc(locate(id).path);
    },

    nextConfirmedId() {
      const used = readdirSync(brain.decisions)
        .map((n) => n.match(CONFIRMED_PREFIX)?.[1])
        .filter(Boolean)
        .map(Number);
      // a restored rule gave its confirmed id back; never hand that id to a different rule
      for (const d of listIn(brain.inbox)) {
        const m = String(d.fm.was_confirmed ?? "").match(/^DB-(\d{3})$/);
        if (m) used.push(Number(m[1]));
      }
      return "DB-" + String(used.length ? Math.max(...used) + 1 : 1).padStart(3, "0");
    },

    nextCandidateId(range = ADDED_RANGE) {
      const used = new Set<number>();
      for (const n of readdirSync(brain.inbox)) {
        const m = n.match(/^DB-c-(\d{3})-/);
        if (m) used.add(Number(m[1]));
      }
      for (const d of listIn(brain.decisions)) {
        const m = String(d.fm.was ?? "").match(/^DB-c-(\d{3})$/);
        if (m) used.add(Number(m[1]));
      }
      for (let n = range; n < range + 100; n++) if (!used.has(n)) return "DB-c-" + String(n).padStart(3, "0");
      throw new Error(`the DB-c-${range}s are full; pass another range`);
    },

    add(c, range = ADDED_RANGE) {
      const need = (ok: unknown, msg: string) => { if (!ok) throw new Error(msg); };
      need(c.title && c.title.length <= TITLE_MAX, `title is required and at most ${TITLE_MAX} characters`);
      need(c.rule?.trim(), "a rule is required");
      need(c.evidence?.length, "at least one evidence line is required");
      need(typeof c.confidence === "number" && c.confidence >= 1 && c.confidence <= 10, "confidence must be 1-10");
      if (c.kind && c.kind !== "harvested") need(c.evidence.some((e) => /^reference:/.test(e)), `a ${c.kind} needs a reference: evidence line`);
      const id = this.nextCandidateId(range);
      const words = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 8);
      while (words.length > 3 && words[words.length - 1].length <= 2) words.pop();
      const slug = words.join("-");
      const file = `${id}-${slug}.md`;
      const dest = brain.path("inbox", file);
      if (existsSync(dest)) throw new Error(`${dest} exists`);
      const fm = [
        `id: ${id}`,
        `title: ${yamlValue(c.title)}`,
        `dimension: ${c.dimension}`,
        `scope: ${yamlValue(c.scope ?? "universal")}`,
        `stance: ${c.stance}`,
        `status: candidate`,
        `kind: ${c.kind ?? "harvested"}`,
        `source: ${yamlValue(c.source ?? "added by hand")}`,
        ...(c.component ? [`component: ${c.component}`] : []),
        `confidence: ${c.confidence}`,
        `occurrences: [${(c.occurrences ?? ["reference"]).join(", ")}]`,
        "evidence:",
        ...c.evidence.map((e) => `  - ${yamlValue(e)}`),
        `last_seen: ${today()}`,
      ].join("\n");
      const body = [
        `## Rule\n\n${c.rule.trim()}`,
        c.why?.trim() ? `## Why\n\n${c.why.trim()}` : "",
        c.examples?.trim() ? `## Examples\n\n${c.examples.trim()}` : "",
        c.exceptions?.trim() ? `## Exceptions\n\n${c.exceptions.trim()}` : "",
      ].filter(Boolean).join("\n\n");
      writeFileSync(dest, `---\n${fm}\n---\n\n${body}\n`);
      return { id, file };
    },

    promote(id, edits) {
      const { path, where } = locate(id);
      if (where !== "inbox") throw new Error(`${id} is already confirmed`);
      const status = parseDoc(path).fm.status;
      if (status !== "candidate") throw new Error(`${id} is ${status}, not a candidate`);
      const newId = this.nextConfirmedId();
      const src = setFields(applyEdits(readFileSync(path, "utf8"), edits), {
        id: newId,
        status: "confirmed",
        promoted: today(),
        was: id,
      });
      const file = `${newId}-${path.split("/").pop()!.replace(CANDIDATE_PREFIX, "")}`;
      const dest = brain.path("decisions", file);
      if (existsSync(dest)) throw new Error(`${dest} exists`);
      writeFileSync(dest, src);
      unlinkSync(path);
      return { id: newId, file };
    },

    retire(id, edits) {
      const { path, where } = locate(id);
      if (where !== "inbox") throw new Error(`${id} is confirmed; move it back to review first`);
      writeFileSync(path, setFields(applyEdits(readFileSync(path, "utf8"), edits), { status: "retired", retired: today() }));
    },

    restore(id) {
      const { path, where } = locate(id);
      const doc = parseDoc(path);
      if (where === "decisions") {
        const was = doc.fm.was ? String(doc.fm.was) : "";
        if (!ID_RE.test(was)) throw new Error(`${id} has no \`was\` field; cannot move it back to review`);
        const src = setFields(readFileSync(path, "utf8"), { id: was, status: "candidate", promoted: null, was: null, was_confirmed: String(doc.fm.id) });
        const dest = brain.path("inbox", path.split("/").pop()!.replace(CONFIRMED_PREFIX, was + "-"));
        if (existsSync(dest)) throw new Error(`${dest} exists`);
        writeFileSync(dest, src);
        unlinkSync(path);
        return { id: was };
      }
      if (doc.fm.status !== "retired") throw new Error(`${id} is already in review`);
      writeFileSync(path, setFields(readFileSync(path, "utf8"), { status: "candidate", retired: null }));
      return { id };
    },

    edit(id, edits) {
      const { path } = locate(id);
      writeFileSync(path, applyEdits(readFileSync(path, "utf8"), edits));
    },

    note(id, text) {
      this.edit(id, { note: text });
    },
  };
}
