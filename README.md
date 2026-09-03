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

## Decide

```bash
design-brain review                 # http://localhost:4455
```

Swipe right to promote, left to retire, down to skip. Adjust stance, scope, confidence,
and leave notes on the card. Undo with Z.

## Use

```bash
design-brain compile                # skills/ and exports/ from confirmed decisions
design-brain install                # symlink skills into ~/.claude/skills
```

## The rules the tool keeps

- A brain is private. The tool repo never contains one.
- Candidates never self-accept; only you promote.
- Skills never name a past project; provenance stays in the ledger by id.
- Client work yields universal craft and constraints, never your taste.

Decisions about the tool itself are recorded as DDRs in `design/decisions/`.
