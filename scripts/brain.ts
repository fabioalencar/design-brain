// A brain is the data directory the tool operates on: sources.yaml plus inbox/, decisions/, …
// This module is the seam. `openBrain` takes a directory and throws; only entry points resolve
// argv/env and exit. Nothing below this line reads global process state.
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

/** The directories `design-brain init` creates, and the only ones any script may address. */
export const DIRS = ["inbox", "decisions", "patterns", "inventory", "skills", "exports", "evals"] as const;
export type DirName = (typeof DIRS)[number];

export class BrainNotFound extends Error {
  constructor(readonly dir: string) {
    super(`No brain at ${dir} (no sources.yaml).\nRun \`design-brain init <dir>\` to create one, or pass --brain <dir> / set DESIGN_BRAIN.`);
    this.name = "BrainNotFound";
  }
}

export interface Project { slug: string; path?: string; scope?: string; aliases?: string[]; [k: string]: unknown }
export interface Sources { projects?: Project[]; [k: string]: unknown }

export type Brain = {
  /** Absolute, with a trailing slash. Prefer `path()` over concatenating this. */
  readonly root: string;
  path(...parts: string[]): string;
  sources(): Sources;
  /** Every project, alias and client name this brain knows. The tool ships none of these. */
  names(): string[];
  /** Slugs whose scope is a client, i.e. work that may never be marked personal. */
  clientSlugs(): string[];
} & { readonly [D in DirName]: string };

export function expandHome(p: string): string {
  return p.replace(/^~(?=$|\/)/, process.env.HOME ?? "");
}

export function openBrain(dir: string): Brain {
  const root = resolve(expandHome(dir));
  if (!existsSync(join(root, "sources.yaml"))) throw new BrainNotFound(root);
  let cached: Sources | undefined;
  const projects = () => (cached?.projects ?? []) as Project[];
  const b = {
    root: root + "/",
    path: (...parts: string[]) => join(root, ...parts),
    sources(): Sources {
      if (!cached) cached = (parseYaml(readFileSync(join(root, "sources.yaml"), "utf8")) ?? {}) as Sources;
      return cached;
    },
    names(): string[] {
      b.sources();
      const out = new Set<string>();
      for (const p of projects()) {
        if (p.slug) out.add(String(p.slug));
        for (const a of p.aliases ?? []) out.add(String(a));
        const s = String(p.scope ?? "");
        if (s.startsWith("client:")) out.add(s.slice("client:".length));
      }
      return [...out].filter(Boolean);
    },
    clientSlugs(): string[] {
      b.sources();
      const out = new Set<string>();
      for (const p of projects()) {
        if (String(p.scope ?? "").startsWith("client:")) {
          if (p.slug) out.add(String(p.slug));
          for (const a of p.aliases ?? []) out.add(String(a));
        }
      }
      return [...out];
    },
  } as Brain;
  for (const d of DIRS) Object.defineProperty(b, d, { value: join(root, d), enumerable: true });
  return b;
}

/** Where a brain comes from on the command line. Pure: hand it argv and env. */
export function resolveBrainDir(argv: string[] = [], env: Record<string, string | undefined> = {}, cwd = "."): string {
  const i = argv.indexOf("--brain");
  return i >= 0 && argv[i + 1] ? argv[i + 1] : env.DESIGN_BRAIN || cwd;
}

/** Entry points only: resolves from the process, prints and exits when there is no brain. */
export function openBrainOrExit(argv: string[] = process.argv): Brain {
  const dir = resolveBrainDir(argv, process.env, process.cwd());
  try {
    return openBrain(dir);
  } catch (e) {
    console.error(e instanceof BrainNotFound ? e.message : String(e));
    process.exit(2);
  }
}
