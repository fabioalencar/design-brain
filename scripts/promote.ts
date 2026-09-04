// design-brain promote|retire|restore|rescope|note <DB-c-###> …
// An argv shim. Every transition lives in ledger.ts, so the CLI and the review app cannot diverge.
import { openBrainOrExit } from "./brain";
import { openLedger } from "./ledger";

const [cmd, ...rest] = process.argv.slice(2);
const args = rest.filter((a, i) => a !== "--brain" && rest[i - 1] !== "--brain");
const ledger = openLedger(openBrainOrExit());

function fail(msg: string): never {
  console.error(msg + "\nusage: promote|retire|restore <DB-c-###> … | rescope <id> <scope> | note <id> <text>");
  process.exit(1);
}
function each(ids: string[], fn: (id: string) => string) {
  if (!ids.length) fail("no ids given");
  for (const id of ids) {
    try {
      console.log(fn(id));
    } catch (e) {
      console.error(`${id}: ${(e as Error).message}`);
      process.exitCode = 1;
    }
  }
}

if (cmd === "promote") each(args, (id) => { const r = ledger.promote(id); return `${id} → ${r.id} (${r.file})`; });
else if (cmd === "retire") each(args, (id) => { ledger.retire(id); return `${id} retired`; });
else if (cmd === "restore") each(args, (id) => `${id} → ${ledger.restore(id).id}, back in review`);
else if (cmd === "rescope") {
  const [id, scope] = args;
  if (!id || !scope) fail("rescope needs an id and a scope");
  ledger.edit(id, { scope });
  console.log(`${id} scope → ${scope}`);
} else if (cmd === "note") {
  const [id, ...words] = args;
  if (!id || !words.length) fail("note needs an id and some text");
  ledger.note(id, words.join(" "));
  console.log(`note added to ${id}`);
} else fail(cmd ? `unknown command: ${cmd}` : "no command given");
