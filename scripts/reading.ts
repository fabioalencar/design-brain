// The reading list: sources saved from the review app, waiting to be read.
// It holds links, not rules, so it lives beside the ledger rather than in it — an underscore
// file the way _review-queue.md and _imports/ are. The add-source skill turns it into candidates.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Brain } from "./brain";

export interface ReadingItem {
  date: string;
  url: string;
  note: string;
}

const FILE = "_reading-list.md";
const HEAD = `# Reading list

Sources saved from the review app, waiting to be turned into candidates by the
\`design-brain-add-source\` skill. It reads each one, keeps the rules a reviewer could
check on a screen, and files them for review. Remove a line once it has been processed.

`;
const LINE = /^-\s+(\d{4}-\d{2}-\d{2})\s+(\S+)(?:\s+[—-]\s+(.*))?$/;

const path = (brain: Brain) => brain.path("inbox", FILE);

export function readReadingList(brain: Brain): ReadingItem[] {
  const p = path(brain);
  if (!existsSync(p)) return [];
  return readFileSync(p, "utf8")
    .split("\n")
    .map((l) => l.trim().match(LINE))
    .filter(Boolean)
    .map((m) => ({ date: m![1], url: m![2], note: (m![3] ?? "").trim() }));
}

function write(brain: Brain, items: ReadingItem[]) {
  const body = items.map((i) => `- ${i.date} ${i.url}${i.note ? ` — ${i.note}` : ""}`).join("\n");
  writeFileSync(path(brain), HEAD + body + (body ? "\n" : ""));
}

/** Appends what is not already listed. Returns the whole list. */
export function addToReadingList(
  brain: Brain,
  entries: { url: string; note?: string }[],
  today = new Date().toISOString().slice(0, 10),
): { items: ReadingItem[]; added: number; skipped: number } {
  const items = readReadingList(brain);
  const seen = new Set(items.map((i) => i.url));
  let added = 0;
  let skipped = 0;
  for (const e of entries) {
    const url = String(e.url ?? "").trim();
    if (!url) continue;
    if (seen.has(url)) {
      skipped++;
      continue;
    }
    seen.add(url);
    items.push({ date: today, url, note: String(e.note ?? "").trim() });
    added++;
  }
  if (added) write(brain, items);
  return { items, added, skipped };
}

export function removeFromReadingList(brain: Brain, urls: string[]): ReadingItem[] {
  const drop = new Set(urls);
  const items = readReadingList(brain).filter((i) => !drop.has(i.url));
  write(brain, items);
  return items;
}

/** One line per URL, optionally "url — note". What someone pastes into the app. */
export function parsePasted(text: string): { url: string; note: string }[] {
  return String(text)
    .split("\n")
    .map((l) => l.trim().replace(/^[-*]\s+/, ""))
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(\S+)(?:\s+[—-]\s+(.*))?$/);
      return m ? { url: m[1], note: (m[2] ?? "").trim() } : null;
    })
    .filter((x): x is { url: string; note: string } => !!x && /^https?:\/\//i.test(x.url));
}
