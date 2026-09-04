# design-brain

Capture the design decisions you keep re-teaching AI, review them in a swipe queue, and
compile the ones you stand behind into agent skills that load on every new project.

It sits above per-project tools: it mines what you already said and built (Claude Code
transcripts, repos, design docs, audits), turns it into candidate rules with evidence,
lets you promote or retire each one, and renders the confirmed set as three skills:
`design-brain` (standing defaults), `design-brain-check` (named failure patterns to
detect), `design-brain-start` (project kickoff). Compiled skills are project-agnostic by
design: no project or client name ever leaves your brain.

## Install

```bash
git clone https://github.com/fabioalencar/design-brain.git
cd design-brain && bun install && bun link
```

## Create your brain

```bash
design-brain init ~/design-brain-me     # private data dir, seeded with references
cd ~/design-brain-me
```

The seed pack is 139 reference candidates you decide on like any other: Nielsen's
heuristics and the Laws of UX as checkable rules, WCAG floors, manipulative patterns and
designer biases to avoid, and good practice for common components (notifications,
settings, search, data tables, filtering, modals, drawers, details pages…).

## Fill it

Edit `sources.yaml` with your projects and their scope (`personal` or `client:<slug>`),
then:

```bash
design-brain harvest:repos          # fonts, palettes, tokens, components → inventory/
design-brain harvest:transcripts    # design directives from Claude Code sessions → review queue
```

Projects on another machine: run `templates/external-extract-prompt.md` there (read-only)
and drop the output into `inbox/_imports/`.

Read something worth keeping? The `design-brain-add-source` skill turns an article or a
guideline page into candidates with a reference back to it:

```bash
design-brain add staged.json       # what that skill stages for you
```

Or press **Save to read later** on the Sources tab to park links, and ask the skill to
process the list when you have time.

## Decide

```bash
design-brain review                 # http://localhost:4455
```

Swipe right to promote, left to retire, down to skip. Adjust stance, scope, confidence,
and leave notes on the card. Undo with Z.

The app has four tabs, reachable with Q, R, O and S: **Queue** (the swipe review),
**Rules** (the whole ledger as a table: confirmed, in review, retired, conflicts; select
rows for bulk verdicts, or open one to edit it and resolve conflicts), **Sources** (every
published reference the ledger cites, grouped by publisher), and **Skills** (what compiled
into each skill, compile and install from there). Light and dark themes follow the system
until you pick one.

When two rules disagree while both apply, declare it with `conflicts_with` and write a
one-line `resolution` saying which wins and when. Two confirmed rules that conflict
without a resolution block the compile.

## Use

```bash
design-brain compile                # skills/ and exports/ from the confirmed decisions
design-brain install                # symlink skills into ~/.claude/skills
```

## Working on the tool

```bash
bun test scripts/          # drives a real brain in a temp directory through the ledger
```

`brain.ts` resolves a brain and hands out its paths; `ledger.ts` owns every mutation of it
(promote, retire, restore, edit, note); `skills.ts` owns the compiled skills. Nothing else
writes a decision file, so the CLI and the review app cannot diverge.

## The rules the tool keeps

- A brain is private. The tool repo never contains one.
- Candidates never self-accept; only you promote.
- Skills never name a past project; provenance stays in the ledger by id.
- Client work yields universal craft and constraints, never your taste.

Decisions about the tool itself are recorded as DDRs in `design/decisions/`.
