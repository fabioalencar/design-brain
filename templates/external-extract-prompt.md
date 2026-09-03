# Design decision extraction (read-only)

Copy everything below the line into a fresh session of any coding agent (Claude Code,
Cursor, Codex, Copilot) opened at the root of the project. Answer the two questions it
asks first. Paste the single markdown document it produces into
`~/Code/design-brain/inbox/_imports/<project-slug>.md`.

---

You are extracting design knowledge from this repository for a designer's personal
cross-project ledger. Your only output is one markdown document, printed in full at the
end of this session. **You will not change anything in this project.**

## Hard rules

1. **Read-only.** Do not edit, create, move, rename, format, or delete any file. Do not
   run install, build, test, lint, format, codegen, or dev-server commands. Do not run any
   git command that writes (no add, commit, checkout, stash, branch, reset). Allowed:
   reading files, listing directories, searching, `git log`, `git show`, `git blame`,
   `git diff` between existing commits. If a tool you are about to use could modify the
   project, do not use it. If you are unsure, do not use it.
2. **No network.** Do not fetch URLs, call APIs, or install anything.
3. **No secrets, no people.** Never read or quote `.env*`, key files, credentials,
   tokens, or customer/user data. Do not include names, emails, or personal data of
   anyone other than the project's own brand.
4. **Skip** `node_modules`, `vendor`, `dist`, `build`, `.next`, `.git` internals,
   lockfiles, generated files, and binary assets.
5. **Facts need a path; rules need evidence.** Every fact cites a file path. Every rule
   cites at least one source (a file path, a doc section, a commit hash with its message,
   or a verbatim quote from a document in the repo). If you cannot cite it, leave it out.
   Never invent a rule to fill a section; an empty section is the correct answer.
6. **Quote verbatim.** When you quote a document, a comment, or a commit message, keep
   its original language and wording, typos included. Rules you write yourself are in
   English.
7. **Rule, then value.** A reusable rule is stated without project-specific values
   ("one accent hue is reserved for the primary action"). The concrete values (a hex, a
   font, a padding) go under Examples.
8. **Output once, complete, as one markdown document.** Do not summarise it in chat; do
   not split it. If it is long, that is fine.

## Before you start, ask me two things and wait for the answers

1. Is this project **personal** (my own brand or unbranded work) or **client** work? If
   client, what is the client's short slug? This sets `scope` for everything below.
2. Are there design conversations, notes, or chat exports outside the repo that I want
   to paste in? If I paste something, treat it as an additional source and quote it as
   `note:<what I called it>`.

## What to look at, in this order

1. **Orientation:** README, package manifest, top-level docs, any of `DESIGN*.md`,
   `BRAND*.md`, `STYLE*.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `docs/`,
   `decisions/`, `adr/`, `design/`, storybook config.
2. **Design carriers:** tailwind config, global CSS, theme files, token files
   (`tokens*.json`, `*.tokens.json`, `design-tokens*`, `theme.ts`, `colors.ts`),
   `components.json`, `components/ui/`, font loading (next/font, @fontsource, Google
   Fonts links, `@font-face`, local font files), layout root files, motion/animation
   config, breakpoints.
3. **Decisions written down:** any ADR/DDR, "why" sections, comments containing
   `intentional`, `deliberate`, `do not`, `never`, `always`, `instead of`, `TODO: decide`,
   `hack`, `workaround`, `revert`.
4. **Decisions in the history:** `git log --oneline` and messages containing `revert`,
   `change … to …`, `instead`, `remove`, `replace`, `back to`, `no more`, `switch`,
   `redesign`, `spacing`, `font`, `color`, `radius`, `padding`. A reversal is a decision.
   A fix that recurs three times is a pattern. Cite the hash and quote the message.
5. **Anything I pasted** as extra sources.

## Output format

Print exactly this structure. Keep the front matter. Replace angle-bracket text. Delete
example rows, keep headings even when empty.

```markdown
---
source: external-extract
project: <slug, lowercase-hyphenated>
scope: <personal | client:<slug>>
extracted: <YYYY-MM-DD>
stack: <one line: framework, styling, component lib, font loading>
language: <en | pt-BR | mixed>
what_it_is: <one sentence>
files_read: <count>
commands_run: <list every command you ran, so I can verify nothing wrote>
---

## 1. Inventory (facts, with paths)

### Fonts
| Role | Family | Weights loaded | Loading method | Path |
|---|---|---|---|---|
| display | | | | |
| body | | | | |
| mono | | | | |

### Palette
| Token / name | Value | Role (primary, accent, bg, ink, semantic…) | Path |
|---|---|---|---|

Color space used: <hex | hsl | oklch | mixed>. Dark mode: <none | class | media | system-with-toggle>.

### Tokens and scales
- Token format: <DTCG | Tokens-Studio | shadcn CSS vars | hand-rolled CSS vars | tailwind theme only | none>, path(s): …
- Spacing scale: … (path)
- Radius scale: … (path)
- Type scale: … (path)
- Breakpoints: … (path)
- Do components actually use the tokens? Spot-check two components; note hardcoded values with paths.

### Components and motion
- Component base: <shadcn n files | own-built | Radix | NativeWind | none>, storybook: <yes/no>
- Notable custom components: …
- Motion: library, easing tokens, durations, reduced-motion handling (paths)

## 2. Decisions (reusable rules with evidence)

One block per rule. Only what the sources support.

### <Short rule stated as a sentence>
- dimension: <typography | color | spacing | layout | motion | copy | components | process>
- stance: <always | never | prefer | avoid | context>
- confidence: <1-10; 8+ only when a document states it or history shows it enforced more than once>
- evidence:
  - `repo:<path>#<section or line>` — "<verbatim quote if any>"
  - `commit:<hash>` — "<verbatim message>"
  - `note:<name>` — "<verbatim quote>"
- why: <the reason the sources give; if you inferred it, write "inferred:" first>
- examples: <the concrete values in this project>
- exceptions: <if any>

## 3. Recurring fixes and patterns

Things that were fixed more than once, or that a reviewer could match on a screen.

### <Pattern name a reviewer can say out loud>
- kind: <anti-slop (a recurring failure) | craft (something deliberately present)>
- looks like: <one or two sentences>
- fix: <a few words>
- evidence: `commit:<hash>` "<message>", `repo:<path>`

## 4. Reversals

Decisions that changed direction, with before → after and the source.

| Before | After | When | Evidence |
|---|---|---|---|

## 5. Glossary

Project-specific or non-English nouns that appear in the sources.

| Term | Meaning | Where |
|---|---|---|

## 6. Could not determine

Questions the repo does not answer (who it is for, why a font was chosen, whether a
value was a choice or a default). One line each. Do not guess.

## 7. Verification

- Files I changed: none
- Commands I ran: <repeat the list>
- Sources outside the repo I used: <none | list>
```

## Quality bar

- Prefer 8 well-evidenced rules over 30 guesses.
- A default that shipped unchanged from a template (shadcn's default primary, Tailwind's
  default radius) is **not** a decision. Say so in section 6 if unsure.
- A client's brand values are constraints, not taste; still record them, scope handles it.
- If the repo has almost no design signal, say that in one line and output the inventory
  only.

When finished, print the document and stop. Do not offer to apply anything.
