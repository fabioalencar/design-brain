// Extracts Fabio's human turns from ~/.claude/projects transcripts for projects in
// sources.yaml, keeps only design-directive-looking turns, and writes them to
// inbox/_review-queue.md for an agent (or Fabio) to turn into candidates.
// Re-runnable: remembers the last timestamp per project in scripts/.cache/state.json.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { listDocs } from "./lib";
import { openBrainOrExit } from "./brain";

const root = openBrainOrExit().root;
const home = process.env.HOME!;
const cfg = parseYaml(readFileSync(root + "sources.yaml", "utf8"));
const tdir = String(cfg.transcripts_dir).replace(/^~/, home);
const cache = root + ".cache/";
mkdirSync(cache, { recursive: true });
const statePath = cache + "state.json";
const state: Record<string, string> = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
const all = process.argv.includes("--all");

// Fuzzy-ish vocabulary: en + pt-BR, tolerant of common typos via loose stems.
const KEY = /\b(font|fonte|tipograf|letter.?spac|tracking|kern|weight|bold|serif|mono|condens|colou?r|cor(es)?\b|palet|hex|#[0-9a-f]{3,6}\b|contrast|off-?white|dark|light|purple|roxo|orange|laranja|verde|green|blue|azul|accent|primary|secondary|cta|button|bot[aã]o|rounded|squared|radius|padding|margin|spacing|espa[cç]|gap|grid|layout|section|se[cç][aã]o|hero|banner|header|footer|nav|menu|logo|card|above the fold|fold|align|center|centr|border|shadow|opacity|overlay|background|fundo|animation|anima|transition|motion|pointer|cursor|scroll|hover|copy|texto|title|t[ií]tulo|headline|humaniz|slop|generic|gen[ée]rico|minimal|option [a-h]\b|direção|direcao|vers[aã]o|variant|looks?|parece|feel|prefer|prefiro|instead|em vez|nunca|never|always|sempre|não|nao\b|don.?t|remove|tira|match|same as|igual)/i;
const NOISE = /^(yes|ok|sim|go ahead|continue|continua|proceed|next|done|thanks|obrigado)\b/i;

type Turn = { project: string; date: string; session: string; text: string };
const turns: Turn[] = [];
for (const p of cfg.projects as any[]) {
  if (!p.transcripts) continue;
  const dir = join(tdir, p.transcripts);
  if (!existsSync(dir)) continue;
  const since = all ? "" : state[p.slug] ?? "";
  let latest = since;
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".jsonl"))) {
    for (const line of readFileSync(join(dir, f), "utf8").split("\n")) {
      if (!line.includes('"type":"user"')) continue;
      let j: any;
      try { j = JSON.parse(line); } catch { continue; }
      if (j.type !== "user" || j.origin?.kind !== "human") continue;
      const ts: string = j.timestamp ?? "";
      if (since && ts <= since) continue;
      const c = j.message?.content;
      const text: string = typeof c === "string" ? c : Array.isArray(c) ? c.filter((x: any) => x.type === "text").map((x: any) => x.text).join(" ") : "";
      const t = text.replace(/\s+/g, " ").trim();
      if (!t || t.startsWith("<") || t.startsWith("[Request") || NOISE.test(t)) continue;
      const hits = new Set((t.match(new RegExp(KEY.source, "gi")) ?? []).map((h) => h.toLowerCase())).size;
      if (hits === 0 || (t.length > 220 && hits < 2) || /^Last login|^\$ |^\{|^\[/.test(t)) continue;
      turns.push({ project: p.slug, date: ts.slice(0, 10), session: f.slice(0, 8), text: t.slice(0, 700) });
      if (ts > latest) latest = ts;
    }
  }
  if (latest) state[p.slug] = latest;
}

// Drop turns already quoted as evidence somewhere.
const known = [...listDocs(root + "inbox"), ...listDocs(root + "decisions"), ...listDocs(root + "patterns")]
  .flatMap((d) => (Array.isArray(d.fm.evidence) ? (d.fm.evidence as string[]) : []))
  .join("\n").toLowerCase();
const fresh = turns.filter((t) => !known.includes(t.text.slice(0, 60).toLowerCase()));

const out = [`# Review queue — ${new Date().toISOString().slice(0, 10)}`, "",
  `${fresh.length} directive-looking turns not yet cited as evidence (${turns.length} matched, ${all ? "full scan" : "incremental"}).`,
  "Turn each into a candidate in inbox/ (or discard). Keep quotes verbatim.", ""];
for (const p of new Set(fresh.map((t) => t.project))) {
  out.push(`## ${p}`, "");
  for (const t of fresh.filter((t) => t.project === p)) out.push(`- \`transcript:${p}:${t.date}\` (${t.session}) ${t.text}`);
  out.push("");
}
writeFileSync(root + "inbox/_review-queue.md", out.join("\n"));
writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log(`${fresh.length} new directive-looking turns → inbox/_review-queue.md`);
