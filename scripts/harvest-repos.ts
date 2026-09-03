// Deterministic extraction of design facts per project → inventory/raw/<slug>.json.
// Facts only: fonts referenced, hex/oklch colors by frequency, token files, radius values.
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { parse as parseYaml } from "yaml";
import { brainRoot } from "./lib";

const root = brainRoot();
const home = process.env.HOME!;
const cfg = parseYaml(readFileSync(root + "sources.yaml", "utf8"));
mkdirSync(root + "inventory/raw", { recursive: true });
const SKIP = new Set(["node_modules", ".next", "dist", "build", ".git", "wp-admin", "wp-includes", "wp-content", "coverage", ".turbo", "out", ".astro", "old-code"]);
const EXT = new Set([".css", ".scss", ".ts", ".tsx", ".js", ".jsx", ".astro", ".html", ".json"]);

function walk(dir: string, depth = 0, acc: string[] = []): string[] {
  if (depth > 7) return acc;
  let names: string[] = [];
  try { names = readdirSync(dir); } catch { return acc; }
  for (const n of names) {
    if (SKIP.has(n) || n.startsWith(".")) continue;
    const p = join(dir, n);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, depth + 1, acc);
    else if (EXT.has(extname(n)) && st.size < 400_000) acc.push(p);
  }
  return acc;
}
const count = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
const top = (m: Map<string, number>, n = 25) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ value: k, uses: v }));

for (const p of cfg.projects as any[]) {
  if (p.path === "external") continue;
  const dir = String(p.path).replace(/^~/, home);
  if (!existsSync(dir)) { console.log(`skip ${p.slug}: ${dir} missing`); continue; }
  const files = walk(dir);
  const hex = new Map<string, number>(), oklch = new Map<string, number>(), fonts = new Map<string, number>(), radius = new Map<string, number>();
  const tokenFiles: string[] = [], fontFiles: string[] = [];
  for (const f of files) {
    const rel = f.slice(dir.length + 1);
    if (/tokens?\.(json|css)|design-tokens|theme\.(ts|js)|colors?\.(ts|js|css)|tailwind\.config|globals?\.css|components\.json/i.test(rel)) tokenFiles.push(rel);
    let s: string; try { s = readFileSync(f, "utf8"); } catch { continue; }
    if (extname(f) === ".json" && !/tokens|components\.json/i.test(rel)) continue;
    for (const m of s.matchAll(/#[0-9a-fA-F]{6}\b/g)) count(hex, m[0].toLowerCase());
    for (const m of s.matchAll(/oklch\([^)]{3,40}\)/g)) count(oklch, m[0].replace(/\s+/g, " "));
    for (const m of s.matchAll(/font-family\s*:\s*([^;}{]+)/g)) count(fonts, m[1].split(",")[0].replace(/["'\s]|var\(.*\)/g, "").trim());
    for (const m of s.matchAll(/googleapis\.com\/css2\?family=([A-Za-z+]+)/g)) count(fonts, m[1].replace(/\+/g, " "));
    for (const m of s.matchAll(/@fontsource(?:-variable)?\/([a-z0-9-]+)/g)) count(fonts, m[1]);
    for (const m of s.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/g)) m[1].split(",").forEach((n) => count(fonts, n.trim().replace(/_/g, " ")));
    for (const m of s.matchAll(/localFont\(\{[\s\S]{0,300}?src\s*:\s*["']([^"']+)["']/g)) count(fonts, "local:" + m[1].split("/").pop());
    for (const m of s.matchAll(/@font-face[^}]*font-family\s*:\s*["']?([^;"'}]+)/g)) { count(fonts, m[1].trim()); fontFiles.push(rel); }
    for (const m of s.matchAll(/(?:--radius[\w-]*|border-radius|borderRadius)\s*:\s*([^;,}\n]+)/g)) count(radius, m[1].trim().slice(0, 30));
  }
  fonts.delete(""); fonts.delete("inherit"); fonts.delete("sans-serif"); fonts.delete("monospace"); fonts.delete("system-ui");
  const facts = { slug: p.slug, scope: p.scope, path: p.path, files_scanned: files.length, token_files: tokenFiles.slice(0, 40), fonts: top(fonts, 15), hex_colors: top(hex, 30), oklch_colors: top(oklch, 20), radius: top(radius, 12), font_face_files: [...new Set(fontFiles)].slice(0, 10) };
  writeFileSync(root + `inventory/raw/${p.slug}.json`, JSON.stringify(facts, null, 2));
  console.log(`${p.slug}: ${files.length} files, ${fonts.size} fonts, ${hex.size} hex, ${oklch.size} oklch, ${tokenFiles.length} token files`);
}
