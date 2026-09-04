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
  if (Array.isArray(v)) return `[${v.join(", ")}]`;
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
    if (value === null) {
      if (i >= 0) lines.splice(i, 1);
      continue;
    }
    const line = `${key}: ${yamlValue(value)}`;
    if (i >= 0) lines[i] = line;
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

export interface Ledger {
  /** Every candidate and decision, inbox first. */
  all(): Doc[];
  candidates(): Doc[];
  confirmed(): Doc[];
  retired(): Doc[];
  get(id: string): Doc;
  nextConfirmedId(): string;
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
    return names.sort().map((n) => parseDoc(dir + "/" + n));
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
      const ids = readdirSync(brain.decisions)
        .map((n) => n.match(CONFIRMED_PREFIX)?.[1])
        .filter(Boolean)
        .map(Number);
      return "DB-" + String(ids.length ? Math.max(...ids) + 1 : 1).padStart(3, "0");
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
        const src = setFields(readFileSync(path, "utf8"), { id: was, status: "candidate", promoted: null, was: null });
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
