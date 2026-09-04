// design-brain add <staged.json>   (or --stdin)
// Writes one or more staged candidates into the brain's inbox through the ledger.
// The agent supplies judgment; this supplies ids, frontmatter and validation.
import { readFileSync } from "node:fs";
import { openBrainOrExit } from "./brain";
import { openLedger, type NewCandidate } from "./ledger";

const args = process.argv.slice(2).filter((a, i, all) => a !== "--brain" && all[i - 1] !== "--brain");
const ledger = openLedger(openBrainOrExit());

function read(): string {
  const file = args.find((a) => !a.startsWith("--"));
  if (file) return readFileSync(file, "utf8");
  if (args.includes("--stdin")) return readFileSync(0, "utf8");
  console.error("usage: design-brain add <staged.json> | --stdin\nThe file holds one candidate object or an array of them.");
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(read());
} catch (e) {
  console.error(`that is not valid JSON: ${(e as Error).message}`);
  process.exit(1);
}

const list = (Array.isArray(parsed) ? parsed : [parsed]) as NewCandidate[];
let failed = 0;
for (const c of list) {
  try {
    const r = ledger.add(c);
    console.log(`${r.id}  ${c.title}`);
  } catch (e) {
    console.error(`refused: ${(e as Error).message}${c.title ? `  (${c.title})` : ""}`);
    failed++;
  }
}
console.log(`${list.length - failed} added to inbox/, ${failed} refused`);
process.exit(failed ? 1 : 0);
