// Local review queue: bun run review  →  http://localhost:4455
// Swipe right = promote, left = retire, down = skip. Writes straight into inbox/ and decisions/.
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync, statSync, lstatSync, readlinkSync, symlinkSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { listDocs, section, longParagraphs, conflictsOf, type Doc, brainRoot, toolRoot } from "./lib";

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
function findAny(id: string): string {
  const inbox = readdirSync(root + "inbox").find((n) => n.startsWith(id + "-") && n.endsWith(".md"));
  if (inbox) return root + "inbox/" + inbox;
  const dec = readdirSync(root + "decisions").find((n) => n.startsWith(id + "-") && n.endsWith(".md"));
  if (dec) return root + "decisions/" + dec;
  throw new Error(`no file for ${id}`);
}
function allRules() {
  const docs = [...listDocs(root + "inbox").filter((d) => !d.file.startsWith("_")), ...listDocs(root + "decisions")];
  const titles = new Map(docs.map((d) => [String(d.fm.id), { title: d.fm.title, status: d.fm.status }]));
  return docs.map((d) => ({ ...card(d), conflicts: conflictsOf(d).map((id) => ({ id, ...(titles.get(id) ?? { title: "(not found)", status: "missing" }) })) }));
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
    notes: section(d.body, "Review notes"), longParas: longParagraphs(d.body).length,
    conflicts_with: conflictsOf(d), resolution: d.fm.resolution ?? "", promoted: d.fm.promoted ?? null, retired: d.fm.retired ?? null, was: d.fm.was ?? null,
    dir: d.path.includes("/decisions/") ? "decisions" : "inbox", review_note: d.fm.review_note ?? null,
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
  const titles = new Map([...listDocs(root + "inbox"), ...listDocs(root + "decisions")].map((d) => [String(d.fm.id), { title: d.fm.title, status: d.fm.status }]));
  return { queue: cands.map((d) => ({ ...card(d), conflicts: conflictsOf(d).map((id) => ({ id, ...(titles.get(id) ?? { title: "(not found)", status: "missing" }) })) })), confirmed, retired };
}

type Verdict = { id: string; action: "promote" | "retire" | "unpromote" | "unretire" | "note" | "edit"; edits?: { stance?: string; scope?: string; confidence?: number; title?: string; note?: string; conflicts_with?: string[]; resolution?: string } };
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
  if (e.conflicts_with !== undefined) {
    const ids = e.conflicts_with.filter(Boolean);
    src = ids.length ? setField(src, "conflicts_with", `[${ids.join(", ")}]`) : src.replace(/^conflicts_with:.*\n/m, "");
  }
  if (e.resolution !== undefined) src = e.resolution.trim() ? setField(src, "resolution", yamlStr(e.resolution.trim())) : src.replace(/^resolution:.*\n/m, "");
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
  if (v.action === "note" || v.action === "edit") {
    const path = findAny(v.id);
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

const SKILLS = ["design-brain", "design-brain-check", "design-brain-start"];
function skillsInfo() {
  const home = process.env.HOME ?? "";
  let last: any = null; try { last = JSON.parse(readFileSync(root + "exports/.compile.json", "utf8")); } catch {}
  const skills = SKILLS.map((name) => {
    const path = root + "skills/" + name + "/SKILL.md";
    if (!existsSync(path)) return { name, exists: false };
    const content = readFileSync(path, "utf8");
    const desc = content.match(/^description:\s*"?([\s\S]*?)"?\n---/m)?.[1]?.replace(/\\"/g, '"') ?? "";
    const body = content.replace(/^---[\s\S]*?---\n/, "");
    const ids = [...new Set(body.match(/DB-(?:c-)?\d{3}/g) ?? [])];
    const sections = [...body.matchAll(/^(##+)\s+(.+)$/gm)].map((m) => ({ level: m[1].length, title: m[2].trim(), rules: 0 }));
    // count rule lines per section
    let cur = -1; for (const line of body.split("\n")) { if (/^##+\s/.test(line)) cur++; else if (/^- \*\*/.test(line) && cur >= 0 && sections[cur]) sections[cur].rules++; }
    const link = join(home, ".claude", "skills", name);
    let installed = false; try { installed = lstatSync(link).isSymbolicLink() && readlinkSync(link) === root + "skills/" + name; } catch {}
    return { name, exists: true, description: desc, words: body.split(/\s+/).length, ids, preview: /PREVIEW BUILD/.test(content), mtime: statSync(path).mtime.toISOString(), sections: sections.filter((x) => x.level === 2 || x.rules), installed, body };
  });
  return { skills, last, brain: root };
}
function install() {
  const home = process.env.HOME ?? "";
  const dir = join(home, ".claude", "skills"); mkdirSync(dir, { recursive: true });
  const done: string[] = [];
  for (const name of SKILLS) {
    const src = root + "skills/" + name, dest = join(dir, name);
    if (!existsSync(src)) throw new Error(`missing ${src}; compile first`);
    try { const st = lstatSync(dest); if (!st.isSymbolicLink()) throw new Error(`${dest} exists and is not a symlink`); unlinkSync(dest); } catch (e: any) { if (e?.code !== "ENOENT") throw e; }
    symlinkSync(src, dest); done.push(name);
  }
  return { ok: true, installed: done };
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/") return new Response(readFileSync(toolRoot + "scripts/review-ui.html", "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
      if (url.pathname === "/api/queue") return Response.json(queue());
      if (url.pathname === "/api/rules") return Response.json({ rules: allRules() });
      if (url.pathname === "/api/skills") return Response.json(skillsInfo());
      if (url.pathname === "/api/install" && req.method === "POST") return Response.json(install());
      if (url.pathname === "/api/verdict" && req.method === "POST") return Response.json(verdict(await req.json()));
      if (url.pathname === "/api/compile" && req.method === "POST") {
        const preview = url.searchParams.get("preview") === "1";
        const p = Bun.spawnSync(["bun", toolRoot + "scripts/compile-skills.ts", "--brain", root, ...(preview ? ["--preview"] : [])], { cwd: root });
        const out = p.stdout.toString() + p.stderr.toString();
        try { const j = JSON.parse(readFileSync(root + "exports/.compile.json", "utf8")); writeFileSync(root + "exports/.compile.json", JSON.stringify({ ...j, ok: p.exitCode === 0, out }, null, 2)); } catch {}
        return Response.json({ ok: p.exitCode === 0, out });
      }
      return new Response("not found", { status: 404 });
    } catch (e: any) {
      return Response.json({ ok: false, error: String(e?.message ?? e) }, { status: 400 });
    }
  },
});
console.log(`design-brain review → http://localhost:${PORT}`);
