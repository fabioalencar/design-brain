// Local review queue: design-brain review  →  http://localhost:4455
// Reads through lib, writes only through the ledger. Serves the app's modules from the tool.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { extname } from "node:path";
import {
  section, longParagraphs, conflictsOf, parseEvidence, type Doc, toolRoot,
  DIMENSIONS, STANCES, STATUSES, KINDS, COMPONENTS, SECTIONS,
} from "./lib";
import { openBrainOrExit } from "./brain";
import { openLedger, type Edits } from "./ledger";
import { SKILL_NAMES, TOOL_SKILLS, readSkill, readToolSkill, lastCompile, installSkills } from "./skills";
import { readReadingList, addToReadingList, removeFromReadingList, parsePasted } from "./reading";

const brain = openBrainOrExit();
const ledger = openLedger(brain);
const PORT = Number(process.env.PORT ?? 4455);

const occ = (d: Doc) => (Array.isArray(d.fm.occurrences) ? (d.fm.occurrences as string[]).length : 0);

function card(d: Doc) {
  const ev = Array.isArray(d.fm.evidence) ? (d.fm.evidence as string[]) : [];
  return {
    id: d.fm.id, file: d.file, title: d.fm.title, dimension: d.fm.dimension, scope: d.fm.scope, stance: d.fm.stance,
    occurrences: d.fm.occurrences ?? [], status: d.fm.status,
    kind: d.fm.kind ?? "harvested", component: d.fm.component ?? null, source: d.fm.source ?? null,
    notes: section(d.body, "Review notes"), longParas: longParagraphs(d.body).length,
    conflicts_with: conflictsOf(d), resolution: d.fm.resolution ?? "",
    promoted: d.fm.promoted ?? null, retired: d.fm.retired ?? null, was: d.fm.was ?? null,
    dir: d.path.includes("/decisions/") ? "decisions" : "inbox", review_note: d.fm.review_note ?? null,
    rule: section(d.body, "Rule"), why: section(d.body, "Why"), examples: section(d.body, "Examples"), exceptions: section(d.body, "Exceptions"),
    evidence: ev, evidenceParsed: ev.map((e) => parseEvidence(e)),
    seeAlso: (d.body.match(/See also:\s*(.+)/)?.[1] ?? "").trim(),
  };
}

/** One assembly for both listings: a card plus its conflicts resolved to titles and statuses. */
function decorate(docs: Doc[], universe: Doc[]) {
  const known = new Map(universe.map((d) => [String(d.fm.id), { title: d.fm.title, status: d.fm.status }]));
  return docs.map((d) => ({
    ...card(d),
    conflicts: conflictsOf(d).map((id) => ({ id, ...(known.get(id) ?? { title: "(not found)", status: "missing" }) })),
  }));
}

function queue() {
  const all = ledger.all();
  const cands = ledger.candidates().sort(
    (a, b) => occ(b) - occ(a) || String(a.fm.id).localeCompare(String(b.fm.id)),
  );
  return { queue: decorate(cands, all), confirmed: ledger.confirmed().length, retired: ledger.retired().length };
}

const rules = () => {
  const all = ledger.all();
  return { rules: decorate(all, all) };
};

const schema = () => ({
  dimensions: DIMENSIONS, stances: STANCES, statuses: STATUSES, kinds: KINDS,
  components: COMPONENTS, sections: SECTIONS, scopes: ["universal", "personal"],
});

type Verdict = { id: string; action: "promote" | "retire" | "unpromote" | "unretire" | "note" | "edit"; edits?: Edits };

function verdict(v: Verdict) {
  switch (v.action) {
    case "promote": {
      const r = ledger.promote(v.id, v.edits);
      return { ok: true, newId: r.id, undo: { id: r.id, action: "unpromote" } };
    }
    case "retire":
      ledger.retire(v.id, v.edits);
      return { ok: true, undo: { id: v.id, action: "unretire" } };
    case "unpromote":
    case "unretire":
      return { ok: true, ...ledger.restore(v.id) };
    case "note":
    case "edit":
      ledger.edit(v.id, v.edits ?? {});
      return { ok: true };
    default:
      throw new Error(`unknown action: ${(v as Verdict).action}`);
  }
}

function compile() {
  const p = Bun.spawnSync(["bun", toolRoot + "scripts/compile-skills.ts", "--brain", brain.root], { cwd: brain.root });
  const out = p.stdout.toString() + p.stderr.toString();
  const record = brain.path("exports", ".compile.json");
  try {
    writeFileSync(record, JSON.stringify({ ...(JSON.parse(readFileSync(record, "utf8")) as object), ok: p.exitCode === 0, out }, null, 2));
  } catch {}
  return { ok: p.exitCode === 0, out };
}

const TYPES: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
function serveFile(rel: string): Response {
  const path = toolRoot + "scripts/" + rel.replace(/\.\./g, "");
  if (!existsSync(path)) return new Response("not found", { status: 404 });
  return new Response(readFileSync(path, "utf8"), { headers: { "content-type": TYPES[extname(path)] ?? "text/plain; charset=utf-8" } });
}

/**
 * A write must come from this app's own page. Browsers set Origin on every cross-origin
 * POST, including the text/plain kind that skips preflight, so an absent Origin is a
 * command-line caller and a mismatched one is another site.
 */
function sameOrigin(req: Request, url: URL): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === url.host;
  } catch {
    return false;
  }
}

Bun.serve({
  port: PORT,
  hostname: "127.0.0.1", // the ledger is private; never listen on the network
  async fetch(req) {
    const url = new URL(req.url);
    try {
      if (req.method === "POST" && !sameOrigin(req, url)) return Response.json({ ok: false, error: "cross-origin write refused" }, { status: 403 });
      if (url.pathname === "/") return serveFile("review-ui.html");
      if (url.pathname.startsWith("/app/")) return serveFile("app/" + url.pathname.slice(5));
      if (url.pathname === "/api/queue") return Response.json(queue());
      if (url.pathname === "/api/rules") return Response.json(rules());
      if (url.pathname === "/api/schema") return Response.json(schema());
      if (url.pathname === "/api/skills") return Response.json({
        skills: SKILL_NAMES.map((n) => readSkill(brain, n)),
        tools: TOOL_SKILLS.map((n) => readToolSkill(n)),
        last: lastCompile(brain), brain: brain.root,
      });
      if (url.pathname === "/api/reading") {
        if (req.method === "POST") {
          const b = (await req.json()) as { text?: string; remove?: string[] };
          if (b.remove) return Response.json({ ok: true, items: removeFromReadingList(brain, b.remove) });
          const r = addToReadingList(brain, parsePasted(b.text ?? ""));
          return Response.json({ ok: true, ...r });
        }
        return Response.json({ items: readReadingList(brain) });
      }
      if (url.pathname === "/api/install" && req.method === "POST") return Response.json({ ok: true, installed: installSkills(brain) });
      if (url.pathname === "/api/verdict" && req.method === "POST") return Response.json(verdict(await req.json()));
      if (url.pathname === "/api/compile" && req.method === "POST") return Response.json(compile());
      return new Response("not found", { status: 404 });
    } catch (e: any) {
      return Response.json({ ok: false, error: String(e?.message ?? e) }, { status: 400 });
    }
  },
});
console.log(`design-brain review → http://127.0.0.1:${PORT}`);
