// Local review queue: bun run review  →  http://localhost:4455
// Swipe right = promote, left = retire, down = skip. Writes straight into inbox/ and decisions/.
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from "node:fs";
import { listDocs, section, longParagraphs, type Doc, brainRoot, toolRoot } from "./lib";

const root = brainRoot();
const PORT = Number(process.env.PORT ?? 4455);
const today = () => new Date().toISOString().slice(0, 10);

function setField(src: string, key: string, value: string): string {
  const re = new RegExp(`^${key}:.*$`, "m");
  return re.test(src) ? src.replace(re, `${key}: ${value}`) : src.replace(/^---\n/, `---\n${key}: ${value}\n`);
}
function yamlStr(v: string) { return JSON.stringify(v); }
function findInbox(id: string) {
  const f = readdirSync(root + "inbox").find((n) => n.startsWith(id + "-") && n.endsWith(".md"));
  if (!f) throw new Error(`no inbox file for ${id}`);
  return root + "inbox/" + f;
}
function nextId(): string {
  const ids = readdirSync(root + "decisions").map((n) => n.match(/^DB-(\d{3})-/)?.[1]).filter(Boolean).map(Number);
  return "DB-" + String(ids.length ? Math.max(...ids) + 1 : 1).padStart(3, "0");
}
function card(d: Doc) {
  const ev = Array.isArray(d.fm.evidence) ? (d.fm.evidence as string[]) : [];
  return {
    id: d.fm.id, file: d.file, title: d.fm.title, dimension: d.fm.dimension, scope: d.fm.scope, stance: d.fm.stance,
    confidence: d.fm.confidence, occurrences: d.fm.occurrences ?? [], status: d.fm.status, kind: d.fm.kind ?? "harvested", component: d.fm.component ?? null,
    notes: section(d.body, "Review notes"), longParas: longParagraphs(d.body).length, review_note: d.fm.review_note ?? null,
    rule: section(d.body, "Rule"), why: section(d.body, "Why"), examples: section(d.body, "Examples"), exceptions: section(d.body, "Exceptions"),
    evidence: ev, seeAlso: (d.body.match(/See also:\s*(.+)/)?.[1] ?? "").trim(),
  };
}
const occ = (d: Doc) => (Array.isArray(d.fm.occurrences) ? (d.fm.occurrences as string[]).length : 0);

function queue() {
  const cands = listDocs(root + "inbox").filter((d) => d.fm.status === "candidate")
    .sort((a, b) => occ(b) - occ(a) || (b.fm.confidence as number) - (a.fm.confidence as number) || String(a.fm.id).localeCompare(String(b.fm.id)));
  const confirmed = listDocs(root + "decisions").length;
  const retired = listDocs(root + "inbox").filter((d) => d.fm.status === "retired").length;
  return { queue: cands.map(card), confirmed, retired };
}

type Verdict = { id: string; action: "promote" | "retire" | "unpromote" | "unretire" | "note"; edits?: { stance?: string; scope?: string; confidence?: number; title?: string; note?: string } };
function addNote(src: string, note?: string): string {
  const n = (note ?? "").trim();
  if (!n) return src;
  const line = `- ${today()}: ${n.replace(/\s*\n\s*/g, " ")}`;
  return /^## Review notes/m.test(src) ? src.replace(/(^## Review notes[^\n]*\n\n?)/m, `$1${line}\n`) : src.trimEnd() + `\n\n## Review notes\n\n${line}\n`;
}
function applyEdits(src: string, e?: Verdict["edits"]) {
  if (!e) return src;
  if (e.stance) src = setField(src, "stance", e.stance);
  if (e.scope) src = setField(src, "scope", e.scope);
  if (e.confidence) src = setField(src, "confidence", String(e.confidence));
  if (e.title) src = setField(src, "title", yamlStr(e.title));
  src = addNote(src, e.note);
  return src;
}
function verdict(v: Verdict) {
  if (v.action === "promote") {
    const path = findInbox(v.id);
    let src = applyEdits(readFileSync(path, "utf8"), v.edits);
    const newId = nextId();
    src = setField(src, "id", newId); src = setField(src, "status", "confirmed"); src = setField(src, "promoted", today()); src = setField(src, "was", v.id);
    const dest = `${root}decisions/${newId}-${path.split("/").pop()!.replace(/^DB-c-\d{3}-/, "")}`;
    if (existsSync(dest)) throw new Error(`${dest} exists`);
    writeFileSync(dest, src); renameSync(path, path + ".bak"); Bun.spawnSync(["rm", path + ".bak"]);
    return { ok: true, newId, undo: { id: newId, action: "unpromote" } };
  }
  if (v.action === "retire") {
    const path = findInbox(v.id);
    let src = applyEdits(readFileSync(path, "utf8"), v.edits);
    src = setField(src, "status", "retired"); src = setField(src, "retired", today());
    writeFileSync(path, src);
    return { ok: true, undo: { id: v.id, action: "unretire" } };
  }
  if (v.action === "note") {
    const path = findInbox(v.id);
    writeFileSync(path, applyEdits(readFileSync(path, "utf8"), v.edits));
    return { ok: true };
  }
  if (v.action === "unpromote") {
    const f = readdirSync(root + "decisions").find((n) => n.startsWith(v.id + "-"));
    if (!f) throw new Error(`no decision ${v.id}`);
    let src = readFileSync(root + "decisions/" + f, "utf8");
    const was = src.match(/^was:\s*(DB-c-\d{3})/m)?.[1];
    if (!was) throw new Error("no `was` field; cannot undo");
    src = setField(src, "id", was); src = setField(src, "status", "candidate"); src = src.replace(/^promoted:.*\n/m, "").replace(/^was:.*\n/m, "");
    writeFileSync(root + "inbox/" + f.replace(/^DB-\d{3}-/, was + "-"), src); Bun.spawnSync(["rm", root + "decisions/" + f]);
    return { ok: true };
  }
  if (v.action === "unretire") {
    const path = findInbox(v.id);
    let src = readFileSync(path, "utf8");
    src = setField(src, "status", "candidate"); src = src.replace(/^retired:.*\n/m, "");
    writeFileSync(path, src);
    return { ok: true };
  }
  throw new Error("unknown action");
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/") return new Response(readFileSync(toolRoot + "scripts/review-ui.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
      if (url.pathname === "/api/queue") return Response.json(queue());
      if (url.pathname === "/api/verdict" && req.method === "POST") return Response.json(verdict(await req.json()));
      if (url.pathname === "/api/compile" && req.method === "POST") {
        const p = Bun.spawnSync(["bun", toolRoot + "scripts/compile-skills.ts", "--brain", root], { cwd: root });
        return Response.json({ ok: p.exitCode === 0, out: p.stdout.toString() + p.stderr.toString() });
      }
      return new Response("not found", { status: 404 });
    } catch (e: any) {
      return Response.json({ ok: false, error: String(e?.message ?? e) }, { status: 400 });
    }
  },
});
console.log(`design-brain review → http://localhost:${PORT}`);
