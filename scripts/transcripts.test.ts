// bun test scripts/transcripts.test.ts
// A fake home with one session per agent, plus a folder of exported chats. What is asserted is
// which project each human turn lands in and which text survives, never how a file was parsed.
import { expect, test, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectTurns, looksLikeDirective, matchProject } from "./transcripts";

const j = (o: unknown) => JSON.stringify(o);

function fakeHome() {
  const home = mkdtempSync(join(tmpdir(), "db-home-"));
  const site = join(home, "code", "site"), app = join(site, "app"), exports = join(home, "exports");
  for (const d of [site, app, exports]) mkdirSync(d, { recursive: true });

  // Claude Code: cwd on the record; a non-human user turn; an injected turn; an assistant turn.
  const cl = join(home, ".claude", "projects", "-code-site");
  mkdirSync(cl, { recursive: true });
  writeFileSync(join(cl, "abcdef12-sess.jsonl"), [
    j({ type: "user", cwd: site, timestamp: "2026-09-01T10:00:00Z", origin: { kind: "human" }, message: { content: "make the CTA squared, not rounded" } }),
    j({ type: "user", cwd: site, timestamp: "2026-09-01T10:01:00Z", origin: { kind: "agent" }, message: { content: [{ type: "text", text: "tool result about fonts" }] } }),
    j({ type: "user", cwd: site, timestamp: "2026-09-01T10:02:00Z", origin: { kind: "human" }, message: { content: "<system-reminder>font stuff</system-reminder>" } }),
    j({ type: "assistant", timestamp: "2026-09-01T10:03:00Z", message: { content: "done with the button" } }),
  ].join("\n"));
  // Claude, legacy: no cwd on the records, attributed through the declared dir name.
  const legacy = join(home, ".claude", "projects", "-code-legacy");
  mkdirSync(legacy, { recursive: true });
  writeFileSync(join(legacy, "leg.jsonl"), j({ type: "user", timestamp: "2026-08-01T09:00:00Z", origin: { kind: "human" }, message: { content: "the hero title uses the serif font" } }));
  // Claude, unmatched: a cwd no project owns.
  const stray = join(home, ".claude", "projects", "-elsewhere");
  mkdirSync(stray, { recursive: true });
  writeFileSync(join(stray, "s.jsonl"), j({ type: "user", cwd: join(home, "elsewhere"), timestamp: "2026-08-02T09:00:00Z", origin: { kind: "human" }, message: { content: "purple background please" } }));

  // Codex: cwd in session_meta, nested under site so the nested project must win; env context injected.
  const cx = join(home, ".codex", "sessions", "2026", "09");
  mkdirSync(cx, { recursive: true });
  writeFileSync(join(cx, "rollout-2026-09-02T10-00-00-aaaa.jsonl"), [
    j({ type: "session_meta", timestamp: "2026-09-02T10:00:00Z", payload: { cwd: app, id: "aaaa" } }),
    j({ type: "response_item", timestamp: "2026-09-02T10:00:01Z", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "<environment_context>\n<cwd>x</cwd>" }] } }),
    j({ type: "response_item", timestamp: "2026-09-02T10:00:02Z", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "use the same condensed font on every banner" }] } }),
    j({ type: "response_item", timestamp: "2026-09-02T10:00:03Z", payload: { type: "message", role: "assistant", content: [{ type: "output_text", text: "ok, font aligned" }] } }),
  ].join("\n"));

  // Exported chats from some other tool: jsonl, json, and plain markdown.
  writeFileSync(join(exports, "chat.jsonl"), [
    j({ role: "user", content: "the footer logo goes first", timestamp: "2026-07-01T08:00:00Z" }),
    j({ role: "assistant", content: "moved the logo" }),
  ].join("\n"));
  writeFileSync(join(exports, "conv.json"), j({ messages: [{ role: "assistant", content: "hi" }, { role: "user", content: "never use pure white for the page background" }] }));
  writeFileSync(join(exports, "note.md"), "Keep the accent orange.\n\nSecond paragraph about spacing.\n");

  const projects = [
    { slug: "site", path: site },
    { slug: "app", path: app },
    { slug: "legacy", transcripts: "-code-legacy" },
    { slug: "notes", transcripts: exports },
  ];
  return { home, site, app, projects };
}

describe("collectTurns", () => {
  const { home, site, app, projects } = fakeHome();
  const turns = collectTurns({ home, projects });
  const by = (slug: string) => turns.filter((t) => t.project === slug).map((t) => t.text);

  test("Claude turns land on the project whose path holds the cwd, humans only, injections dropped", () => {
    expect(by("site")).toEqual(["make the CTA squared, not rounded"]);
    expect(turns.find((t) => t.project === "site")?.agent).toBe("claude");
  });

  test("Codex turns land on the nested project, not its parent; environment context is dropped", () => {
    expect(by("app")).toEqual(["use the same condensed font on every banner"]);
    expect(turns.find((t) => t.project === "app")?.agent).toBe("codex");
  });

  test("a Claude project dir name declared as transcripts still attributes sessions without a cwd", () => {
    expect(by("legacy")).toEqual(["the hero title uses the serif font"]);
  });

  test("a folder of exported chats yields user turns from jsonl, json and markdown", () => {
    expect(by("notes").sort()).toEqual(["Keep the accent orange.", "Second paragraph about spacing.", "never use pure white for the page background", "the footer logo goes first"].sort());
    expect(turns.filter((t) => t.project === "notes").every((t) => t.agent === "export")).toBe(true);
  });

  test("sessions no project owns are dropped", () => {
    expect(turns.some((t) => t.text.includes("purple background"))).toBe(false);
  });

  test("--agents narrows the sources", () => {
    const only = collectTurns({ home, projects, agents: ["codex"] });
    expect(new Set(only.map((t) => t.agent))).toEqual(new Set(["codex"]));
  });

  test("every turn carries a date and a short session id", () => {
    for (const t of turns) { expect(t.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); expect(t.session.length).toBeLessThanOrEqual(8); }
  });

  test("matchProject prefers the longest containing path", () => {
    expect(matchProject(join(app, "src"), projects, home)?.slug).toBe("app");
    expect(matchProject(site, projects, home)?.slug).toBe("site");
    expect(matchProject(join(home, "other"), projects, home)).toBeNull();
    expect(matchProject(null, projects, home)).toBeNull();
  });
});

describe("looksLikeDirective", () => {
  test("keeps design directives", () => {
    expect(looksLikeDirective("make the CTA squared, not rounded")).toBe(true);
    expect(looksLikeDirective("nunca usar branco puro no fundo")).toBe(true);
  });
  test("drops chatter, injections and long text with a single stray keyword", () => {
    expect(looksLikeDirective("ok")).toBe(false);
    expect(looksLikeDirective("<system-reminder>font</system-reminder>")).toBe(false);
    expect(looksLikeDirective("x".repeat(300) + " font")).toBe(false);
  });
});
