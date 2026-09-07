// Transcripts from any coding agent, read into one shape: the human turns of a session, and the
// working directory the session ran in. The harvester never asks which agent wrote a file; it
// asks which project a session belongs to, and answers that by matching the session's cwd against
// `path` in sources.yaml. One adapter per agent knows the file layout; everything after is shared.
//
// Pure: hand it a home directory and a project list. Nothing here reads process state.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, basename } from "node:path";

export interface ProjectRef { slug: string; path?: string; transcripts?: string }
export interface RawTurn { ts: string; text: string }
export interface Session { agent: string; file: string; cwd: string | null; dirName: string; turns: RawTurn[] }
export interface Turn { agent: string; project: string; ts: string; date: string; session: string; text: string }

export interface Adapter {
  agent: string;
  /** Where this agent keeps sessions. Only roots that exist are read. */
  roots(home: string): string[];
  /** File extensions this adapter reads under its roots. */
  exts: string[];
  parse(file: string): Session | null;
}

const asText = (c: unknown): string => {
  if (typeof c === "string") return c;
  if (Array.isArray(c)) return c.map((x: any) => (typeof x === "string" ? x : x?.text ?? x?.input_text ?? "")).join(" ");
  if (c && typeof c === "object" && typeof (c as any).text === "string") return (c as any).text;
  return "";
};
const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Text an agent injected around the human's words, never the human's own words. */
export const INJECTED = /^(<|\[Request|# Files mentioned by the user|Last login|\$ |\{|\[)/;

// ---------- Claude Code: ~/.claude/projects/<encoded-cwd>/<session>.jsonl ----------
export const claude: Adapter = {
  agent: "claude",
  roots: (home) => [join(home, ".claude", "projects")],
  exts: [".jsonl"],
  parse(file) {
    const turns: RawTurn[] = [];
    let cwd: string | null = null;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      if (!line.includes('"type":"user"')) continue;
      let j: any;
      try { j = JSON.parse(line); } catch { continue; }
      if (j.type !== "user") continue;
      if (!cwd && typeof j.cwd === "string") cwd = j.cwd;
      if (j.origin?.kind !== "human") continue;
      const text = clean(asText(j.message?.content));
      if (text) turns.push({ ts: String(j.timestamp ?? ""), text });
    }
    return { agent: "claude", file, cwd, dirName: basename(join(file, "..")), turns };
  },
};

// ---------- Codex CLI: ~/.codex/sessions/**/rollout-*.jsonl (and archived_sessions) ----------
export const codex: Adapter = {
  agent: "codex",
  roots: (home) => [join(home, ".codex", "sessions"), join(home, ".codex", "archived_sessions")],
  exts: [".jsonl"],
  parse(file) {
    const turns: RawTurn[] = [];
    let cwd: string | null = null;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      if (!line.includes("session_meta") && !line.includes('"role":"user"')) continue;
      let j: any;
      try { j = JSON.parse(line); } catch { continue; }
      const p = j.payload ?? {};
      if (j.type === "session_meta" && typeof p.cwd === "string") { cwd = p.cwd; continue; }
      if (j.type !== "response_item" || p.type !== "message" || p.role !== "user") continue;
      const text = clean(asText(p.content));
      if (text) turns.push({ ts: String(j.timestamp ?? ""), text });
    }
    return { agent: "codex", file, cwd, dirName: basename(join(file, "..")), turns };
  },
};

// ---------- Anything else: a folder of exported chats you point a project at ----------
// .jsonl or .json with role/type "user" records (the shape most tools export), or .md/.txt read
// as paragraphs. No cwd: the turns belong to the project that declared the folder.
export const generic: Adapter = {
  agent: "export",
  roots: () => [],
  exts: [".jsonl", ".json", ".md", ".txt"],
  parse(file) {
    const turns: RawTurn[] = [];
    const src = readFileSync(file, "utf8");
    const mtime = statSync(file).mtime.toISOString();
    const user = (m: any) => m && (m.role === "user" || m.type === "user" || m.author === "user" || m.from === "user");
    const text = (m: any) => clean(asText(m.content ?? m.message?.content ?? m.text ?? m.message ?? ""));
    const stamp = (m: any) => String(m.timestamp ?? m.ts ?? m.created_at ?? m.time ?? mtime);
    if (file.endsWith(".jsonl")) {
      for (const line of src.split("\n")) {
        let j: any;
        try { j = JSON.parse(line); } catch { continue; }
        if (user(j) && text(j)) turns.push({ ts: stamp(j), text: text(j) });
      }
    } else if (file.endsWith(".json")) {
      let j: any;
      try { j = JSON.parse(src); } catch { return null; }
      const list: any[] = Array.isArray(j) ? j : j.messages ?? j.history ?? j.turns ?? j.mapping ?? [];
      for (const m of Array.isArray(list) ? list : Object.values(list)) {
        const msg = (m as any)?.message ?? m;
        if (user(msg) && text(msg)) turns.push({ ts: stamp(msg), text: text(msg) });
      }
    } else {
      for (const para of src.split(/\n\s*\n/)) {
        const t = clean(para);
        if (t) turns.push({ ts: mtime, text: t });
      }
    }
    return { agent: "export", file, cwd: null, dirName: basename(join(file, "..")), turns };
  },
};

export const ADAPTERS: Adapter[] = [claude, codex];

export function listFiles(dir: string, exts: string[], out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) listFiles(p, exts, out);
    else if (exts.some((e) => name.name.endsWith(e))) out.push(p);
  }
  return out;
}

const expand = (p: string, home: string) => resolve(p.replace(/^~(?=$|\/)/, home));

/** The project whose `path` contains cwd. Longest path wins, so a nested project beats its parent. */
export function matchProject(cwd: string | null, projects: ProjectRef[], home: string): ProjectRef | null {
  if (!cwd) return null;
  const c = resolve(cwd);
  let best: ProjectRef | null = null, bestLen = -1;
  for (const p of projects) {
    if (!p.path) continue;
    const root = expand(p.path, home);
    if ((c === root || c.startsWith(root + "/")) && root.length > bestLen) { best = p; bestLen = root.length; }
  }
  return best;
}

/** Does `transcripts:` name a folder (any agent's export), rather than a Claude project dir name? */
const isFolder = (v: string) => v.startsWith("~") || v.startsWith("/") || v.startsWith(".");

export interface CollectOptions {
  home: string;
  projects: ProjectRef[];
  /** Restrict to these agents; default all built-in adapters plus declared export folders. */
  agents?: string[];
  /** Legacy: the Claude projects dir, when sources.yaml still sets `transcripts_dir`. */
  claudeDir?: string;
}

/** Every human turn from every agent, attributed to a project. Unattributed sessions are dropped. */
export function collectTurns(o: CollectOptions): Turn[] {
  const want = (a: string) => !o.agents || o.agents.includes(a);
  const out: Turn[] = [];
  const push = (s: Session, slug: string) => {
    for (const t of s.turns) {
      if (INJECTED.test(t.text)) continue;
      out.push({ agent: s.agent, project: slug, ts: t.ts, date: t.ts.slice(0, 10), session: basename(s.file).replace(/\.[a-z]+$/, "").slice(0, 8), text: t.text.slice(0, 700) });
    }
  };
  for (const a of ADAPTERS) {
    if (!want(a.agent)) continue;
    const roots = a.roots(o.home);
    if (a.agent === "claude" && o.claudeDir) roots.unshift(expand(o.claudeDir, o.home));
    for (const root of new Set(roots)) {
      for (const f of listFiles(root, a.exts)) {
        const s = a.parse(f);
        if (!s || !s.turns.length) continue;
        // cwd first; a Claude project dir name declared as `transcripts:` is the fallback.
        const p = matchProject(s.cwd, o.projects, o.home)
          ?? (a.agent === "claude" ? o.projects.find((x) => x.transcripts && !isFolder(x.transcripts) && x.transcripts === s.dirName) ?? null : null);
        if (p) push(s, p.slug);
      }
    }
  }
  if (want(generic.agent)) {
    for (const p of o.projects) {
      if (!p.transcripts || !isFolder(p.transcripts)) continue;
      for (const f of listFiles(expand(p.transcripts, o.home), generic.exts)) {
        const s = generic.parse(f);
        if (s) push(s, p.slug);
      }
    }
  }
  return out;
}

// Fuzzy-ish vocabulary: en + pt-BR, tolerant of common typos via loose stems.
const KEY = /\b(font|fonte|tipograf|letter.?spac|tracking|kern|weight|bold|serif|mono|condens|colou?r|cor(es)?\b|palet|hex|#[0-9a-f]{3,6}\b|contrast|off-?white|dark|light|purple|roxo|orange|laranja|verde|green|blue|azul|accent|primary|secondary|cta|button|bot[aã]o|rounded|squared|radius|padding|margin|spacing|espa[cç]|gap|grid|layout|section|se[cç][aã]o|hero|banner|header|footer|nav|menu|logo|card|above the fold|fold|align|center|centr|border|shadow|opacity|overlay|background|fundo|animation|anima|transition|motion|pointer|cursor|scroll|hover|copy|texto|title|t[ií]tulo|headline|humaniz|slop|generic|gen[ée]rico|minimal|option [a-h]\b|direção|direcao|vers[aã]o|variant|looks?|parece|feel|prefer|prefiro|instead|em vez|nunca|never|always|sempre|não|nao\b|don.?t|remove|tira|match|same as|igual)/i;
const NOISE = /^(yes|ok|sim|go ahead|continue|continua|proceed|next|done|thanks|obrigado)\b/i;

/** A turn that reads like a design directive rather than chatter, code, or a pasted log. */
export function looksLikeDirective(t: string): boolean {
  if (!t || NOISE.test(t) || INJECTED.test(t)) return false;
  const hits = new Set((t.match(new RegExp(KEY.source, "gi")) ?? []).map((h) => h.toLowerCase())).size;
  return hits > 0 && !(t.length > 220 && hits < 2);
}
