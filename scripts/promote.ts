// bun run promote DB-c-104 [DB-c-200 ...]   → moves inbox candidate to decisions/ as DB-### confirmed
// bun run retire  DB-c-104 [...]            → marks it retired in place (never harvested again)
// bun run rescope DB-c-104 client:client-a     → changes scope
import { readdirSync, readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { brainRoot } from "./lib";

const root = brainRoot();
const [cmd, ...args] = process.argv.slice(2);
const today = new Date().toISOString().slice(0, 10);

function find(id: string): string {
  const f = readdirSync(root + "inbox").find((n) => n.startsWith(id + "-") && n.endsWith(".md"));
  if (!f) throw new Error(`no inbox file for ${id}`);
  return root + "inbox/" + f;
}
function nextId(): number {
  const ids = readdirSync(root + "decisions").map((n) => n.match(/^DB-(\d{3})-/)?.[1]).filter(Boolean).map(Number);
  return ids.length ? Math.max(...ids) + 1 : 1;
}
function setField(src: string, key: string, value: string): string {
  const re = new RegExp(`^${key}:.*$`, "m");
  return re.test(src) ? src.replace(re, `${key}: ${value}`) : src.replace(/^---\n/, `---\n${key}: ${value}\n`);
}

if (cmd === "promote") {
  for (const id of args) {
    const path = find(id);
    let src = readFileSync(path, "utf8");
    const n = String(nextId()).padStart(3, "0");
    const newId = `DB-${n}`;
    src = setField(src, "id", newId);
    src = setField(src, "status", "confirmed");
    src = setField(src, "promoted", today);
    src = setField(src, "was", id);
    const slug = path.split("/").pop()!.replace(/^DB-c-\d{3}-/, "");
    const dest = `${root}decisions/${newId}-${slug}`;
    if (existsSync(dest)) throw new Error(`${dest} exists`);
    writeFileSync(dest, src);
    renameSync(path, path + ".promoted");
    execSync(`rm "${path}.promoted"`);
    console.log(`${id} → ${newId} (${slug})`);
  }
} else if (cmd === "retire") {
  for (const id of args) {
    const path = find(id);
    let src = readFileSync(path, "utf8");
    src = setField(src, "status", "retired");
    src = setField(src, "retired", today);
    writeFileSync(path, src);
    console.log(`${id} retired`);
  }
} else if (cmd === "rescope") {
  const [id, scope] = args;
  const path = find(id);
  writeFileSync(path, setField(readFileSync(path, "utf8"), "scope", scope));
  console.log(`${id} scope → ${scope}`);
} else {
  console.log("usage: promote|retire|rescope <DB-c-###> ...");
  process.exit(1);
}
