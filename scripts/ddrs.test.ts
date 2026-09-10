// bun test scripts/ddrs.test.ts
// A fake project with decision records in both formats. What is asserted is which decisions
// get staged, what the candidate carries, and what the agent is still asked to supply.
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { citedDdrFiles, ddrProjects, firstParagraph, firstSentence, listDdrs, parseDdr, stageDdr } from "./ddrs";
import type { Doc } from "./lib";

const forgeStyle = (id: string, title: string, status: string, body: string) =>
  `---\ntype: Decision\nid: ${id}\ntitle: "${title}"\ndate: 2026-08-01\ndecision_status: ${status}\n---\n${body}\n`;
const bulletStyle = (id: string, title: string, status: string, body: string) =>
  `# ${id} — ${title}\n\n- **Status**: ${status}\n- **Date**: 2026-05-02\n\n${body}\n`;

function fakeProject() {
  const root = mkdtempSync(join(tmpdir(), "db-ddrs-"));
  const dir = join(root, "design", "decisions");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "DDR-000-template.md"), forgeStyle("DDR-000", "Title", "draft", "## Decision\n\nOne paragraph.\n"));
  writeFileSync(join(dir, "DDR-001-no-enumeration.md"), forgeStyle("DDR-001", "No screen reveals whether an address has an account", "accepted",
    "## Decision\n\nThe sign-in error names **both fields** together, and the reset\nconfirmation says the same sentence either way. Neither screen varies.\n\nSecond paragraph is not the rule.\n\n## Why\n\n- a list first\n\nA screen that says \"no such user\" is an enumeration oracle.\n\n## Alternatives rejected\n\nBe specific on sign-in.\n"));
  writeFileSync(join(dir, "DDR-002-superseded.md"), forgeStyle("DDR-002", "Old choice", "superseded", "## Decision\n\nGone.\n"));
  writeFileSync(join(dir, "DDR-003-long-title.md"), forgeStyle("DDR-003", "A title that goes on and on well past the eighty character limit the ledger enforces on candidates", "accepted", "## Decision\n\nShort rule.\n"));
  writeFileSync(join(dir, "notes.md"), "not a decision");
  const old = join(root, "decisions");
  mkdirSync(old, { recursive: true });
  writeFileSync(join(old, "DDR-000-template.md"), bulletStyle("DDR-000", "Title", "proposed | accepted | superseded by DDR-###", "## Decision\n\nOne paragraph.\n"));
  writeFileSync(join(old, "DDR-003-non-blocking-checkpoints.md"), bulletStyle("DDR-003", "Checkpoints never block", "accepted", "## Decision\n\nA checkpoint is an offer. It never blocks the flow.\n\n## Why\n\nBlocking prompts train people to dismiss.\n"));
  return { root, dir, old };
}

describe("parseDdr", () => {
  test("reads the frontmatter format: id, title, status, first paragraphs, emphasis stripped", () => {
    const { dir } = fakeProject();
    const d = parseDdr(join(dir, "DDR-001-no-enumeration.md"))!;
    expect(d.id).toBe("DDR-001");
    expect(d.number).toBe(1);
    expect(d.status).toBe("accepted");
    expect(d.date).toBe("2026-08-01");
    expect(d.decision).toBe("The sign-in error names both fields together, and the reset confirmation says the same sentence either way. Neither screen varies.");
    expect(d.why).toBe('A screen that says "no such user" is an enumeration oracle.');
  });
  test("reads the bullet format the pre-Forge records use", () => {
    const { old } = fakeProject();
    const d = parseDdr(join(old, "DDR-003-non-blocking-checkpoints.md"))!;
    expect(d).toMatchObject({ id: "DDR-003", title: "Checkpoints never block", status: "accepted", date: "2026-05-02" });
    expect(d.decision).toBe("A checkpoint is an offer. It never blocks the flow.");
    expect(d.why).toBe("Blocking prompts train people to dismiss.");
  });
  test("a template whose status is the enum list is not accepted", () => {
    const { old } = fakeProject();
    expect(parseDdr(join(old, "DDR-000-template.md"))!.status).toBe("proposed");
  });
});

describe("listDdrs", () => {
  test("only DDR-###-*.md files, in id order; other markdown is ignored", () => {
    const { dir } = fakeProject();
    expect(listDdrs(dir).map((d) => d.id)).toEqual(["DDR-000", "DDR-001", "DDR-002", "DDR-003"]);
  });
  test("a missing directory is an empty list, not an error", () => {
    expect(listDdrs("/nowhere/decisions")).toEqual([]);
  });
});

describe("citedDdrFiles", () => {
  test("matches on the file name, so a moved repo keeps its old citations", () => {
    const docs = [
      { fm: { evidence: ['ddr:~/Code/forge/design/decisions/DDR-022-graphite-home.md "quote"', "repo:~/Code/x/app.css"] } },
      { fm: { evidence: "ddr:~/Code/ai-design/forge/design/decisions/DDR-111-a-feedback-round-has-an-end.md" } },
      { fm: {} },
    ] as unknown as Doc[];
    const cited = citedDdrFiles(docs);
    expect(cited.has("DDR-022-graphite-home.md")).toBe(true);
    expect(cited.has("DDR-111-a-feedback-round-has-an-end.md")).toBe(false); // a string, not a list: not evidence
    expect(cited.size).toBe(1);
  });
});

describe("ddrProjects", () => {
  test("keeps projects with a ddr_dir, a local path and a scope; says why the rest are skipped", () => {
    const { ok, skipped } = ddrProjects([
      { slug: "forge", path: "~/Code/forge", scope: "personal", ddr_dir: "design/decisions" },
      { slug: "site", path: "~/Code/site", scope: "personal" },
      { slug: "ext", path: "external", scope: "client:x", ddr_dir: "decisions" },
      { slug: "noscope", path: "~/Code/n", ddr_dir: "decisions" },
    ]);
    expect(ok.map((p) => p.slug)).toEqual(["forge"]);
    expect(skipped).toEqual([{ slug: "ext", why: "no local path" }, { slug: "noscope", why: "no scope; a harvest never guesses one" }]);
  });
});

describe("stageDdr", () => {
  const project = { slug: "login-demo", path: "~/Code/login-demo", scope: "personal", ddr_dir: "design/decisions" };
  test("fills everything but dimension and stance; evidence is the ddr line with the first sentence quoted", () => {
    const { dir } = fakeProject();
    const s = stageDdr(parseDdr(join(dir, "DDR-001-no-enumeration.md"))!, project);
    expect(s.candidate.dimension).toBe("");
    expect(s.candidate.stance).toBe("");
    expect(s.candidate).toMatchObject({
      title: "No screen reveals whether an address has an account", kind: "harvested", scope: "personal", source: "forge record",
      occurrences: ["login-demo"], _ddr: "DDR-001", _date: "2026-08-01", _warnings: [],
    });
    expect(s.candidate.evidence).toEqual(['ddr:~/Code/login-demo/design/decisions/DDR-001-no-enumeration.md "The sign-in error names both fields together, and the reset confirmation says the same sentence either way."']);
    expect(s.candidate.rule).toBe(s.ddr.decision);
    expect(s.candidate.why).toBe(s.ddr.why);
  });
  test("a client project's decision inherits the client scope", () => {
    const { dir } = fakeProject();
    const s = stageDdr(parseDdr(join(dir, "DDR-001-no-enumeration.md"))!, { ...project, scope: "client:acme" });
    expect(s.candidate.scope).toBe("client:acme");
  });
  test("a title over the ledger's limit is flagged, not truncated", () => {
    const { dir } = fakeProject();
    const s = stageDdr(parseDdr(join(dir, "DDR-003-long-title.md"))!, project);
    expect(s.candidate.title.length).toBeGreaterThan(80);
    expect(s.candidate._warnings).toEqual(["title is 98 chars; shorten to 80"]);
  });
});

describe("text helpers", () => {
  test("firstParagraph skips lists and strips bold", () => {
    expect(firstParagraph("- item\n\n**Strong** start\ncontinues.\n\nNext.")).toBe("Strong start continues.");
  });
  test("firstSentence stops at the first terminator and swaps double quotes", () => {
    expect(firstSentence('Say "no". Then more.')).toBe("Say 'no'.");
    expect(firstSentence("No terminator here")).toBe("No terminator here");
  });
});
