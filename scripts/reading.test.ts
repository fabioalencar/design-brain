// bun test scripts/reading.test.ts
// The reading list: what someone pastes into the review app, what lands in inbox/_reading-list.md,
// and what comes back out of it. A real brain in a temp directory; the date is injected, never
// read from the clock, so the same run today and next year says the same thing.
import { expect, test, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openBrain, DIRS } from "./brain";
import { parsePasted, addToReadingList, readReadingList, removeFromReadingList } from "./reading";

function newBrain() {
  const dir = mkdtempSync(join(tmpdir(), "db-reading-"));
  for (const d of DIRS) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "sources.yaml"), "projects:\n  - slug: meridian\n    scope: personal\n");
  return openBrain(dir);
}

const listFile = (b: ReturnType<typeof newBrain>) => b.path("inbox", "_reading-list.md");
const A = "https://example.com/type-scales";
const B = "https://example.com/contrast";
const C = "https://example.com/motion";

describe("parsePasted", () => {
  test("one url per line", () => {
    expect(parsePasted(`${A}\n${B}`)).toEqual([
      { url: A, note: "" },
      { url: B, note: "" },
    ]);
  });

  test("a dash after the url starts the note", () => {
    expect(parsePasted(`${A} — worth a second read\n${B} - shorter dash, same note`)).toEqual([
      { url: A, note: "worth a second read" },
      { url: B, note: "shorter dash, same note" },
    ]);
  });

  test("a bullet in front of the url is not part of the url", () => {
    expect(parsePasted(`- ${A}\n*   ${B} — from a newsletter`)).toEqual([
      { url: A, note: "" },
      { url: B, note: "from a newsletter" },
    ]);
  });

  test("lines that are not urls are dropped, not kept as empty rows", () => {
    expect(parsePasted(`things to read:\n${A}\n\n   \nnot a link either`)).toEqual([{ url: A, note: "" }]);
  });
});

describe("the list on disk", () => {
  test("the first entry creates the file", () => {
    const b = newBrain();
    expect(existsSync(listFile(b))).toBe(false);
    const r = addToReadingList(b, [{ url: A, note: "type scales" }], "2026-01-05");
    expect(r.added).toBe(1);
    expect(existsSync(listFile(b))).toBe(true);
    expect(readingListOf(b)).toEqual([{ date: "2026-01-05", url: A, note: "type scales" }]);
  });

  test("a later entry appends, and earlier entries keep their own date", () => {
    const b = newBrain();
    addToReadingList(b, [{ url: A }], "2026-01-05");
    const r = addToReadingList(b, [{ url: B, note: "contrast" }], "2026-02-11");
    expect(r.added).toBe(1);
    expect(readingListOf(b)).toEqual([
      { date: "2026-01-05", url: A, note: "" },
      { date: "2026-02-11", url: B, note: "contrast" },
    ]);
  });

  test("a url already listed is skipped and counted, not duplicated", () => {
    const b = newBrain();
    addToReadingList(b, [{ url: A, note: "the first note wins" }], "2026-01-05");
    const r = addToReadingList(b, [{ url: A, note: "a second note" }, { url: B }], "2026-02-11");
    expect(r).toMatchObject({ added: 1, skipped: 1 });
    const items = readingListOf(b);
    expect(items.map((i) => i.url)).toEqual([A, B]);
    expect(items[0]).toEqual({ date: "2026-01-05", url: A, note: "the first note wins" });
  });

  test("duplicates inside one paste are collapsed too", () => {
    const b = newBrain();
    const r = addToReadingList(b, [{ url: A }, { url: A }, { url: "  " }], "2026-01-05");
    expect(r).toMatchObject({ added: 1, skipped: 1 });
    expect(readingListOf(b).length).toBe(1);
  });

  test("no file yet means an empty list, not a crash", () => {
    expect(readReadingList(newBrain())).toEqual([]);
  });

  test("a note containing a dash survives the round trip", () => {
    const b = newBrain();
    addToReadingList(b, [{ url: A, note: "grid systems - and rhythm" }], "2026-01-05");
    expect(readingListOf(b)[0].note).toBe("grid systems - and rhythm");
  });

  test("the file keeps its heading, so a reader knows what it is", () => {
    const b = newBrain();
    addToReadingList(b, [{ url: A }], "2026-01-05");
    expect(readFileSync(listFile(b), "utf8")).toContain("# Reading list");
  });

  test("remove takes out the one named and leaves the rest in order", () => {
    const b = newBrain();
    addToReadingList(b, [{ url: A }, { url: B, note: "contrast" }, { url: C }], "2026-01-05");
    const left = removeFromReadingList(b, [B]);
    expect(left.map((i) => i.url)).toEqual([A, C]);
    expect(readingListOf(b).map((i) => i.url)).toEqual([A, C]);
  });

  test("removing a url that is not listed changes nothing", () => {
    const b = newBrain();
    addToReadingList(b, [{ url: A }], "2026-01-05");
    expect(removeFromReadingList(b, ["https://example.com/never-saved"]).map((i) => i.url)).toEqual([A]);
    expect(readingListOf(b).length).toBe(1);
  });
});

/** Re-read from disk rather than trusting what the writer returned. */
function readingListOf(b: ReturnType<typeof newBrain>) {
  return readReadingList(b);
}
