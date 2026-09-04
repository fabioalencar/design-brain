# Agent rules for the design-brain tool

This repository is the **tool**: scripts, templates, the review app, the compiler, the
extraction prompt, and the seed pack. It never contains a brain. A brain is a separate,
private data directory (see `templates/brain/`) that the tool operates on via
`--brain <dir>`, `$DESIGN_BRAIN`, or the current directory.

0. **Two kinds of skill live here.** `agent-skills/` is hand-written and shipped by the tool
   (capture skills like `design-brain-add-source`). A brain's `skills/` is compiled output.
   `design-brain install` links both; `compile` only ever writes the brain's.
1. **No harvested content here.** Never commit candidates, decisions, patterns, inventory,
   transcripts, or anything naming a real project or client. `seed/` holds only reference
   candidates (`kind: heuristic | bias | practice`) with published sources.
2. **Compiled output is project-agnostic** (DDR-005). The compiler must never emit a
   project name, path, quote, or project-specific value; the leak guard enforces it.
3. **Candidates never self-accept** (DDR-002). Only the human promotes.
4. **This repo has a Forge record** in `design/` (brief, DDRs, questions, todos, glossary).
   Decisions about the tool go through the `ddr` skill; run `forge doctor` after touching
   `design/`.
5. Test against a real brain before shipping: `bun scripts/check.ts --brain <dir>` and
   `bun scripts/compile-skills.ts --brain <dir> --preview` must pass.
