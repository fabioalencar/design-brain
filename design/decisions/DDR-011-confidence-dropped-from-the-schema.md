---
type: Decision
id: DDR-011
title: Confidence is dropped from the schema; exports derive a weight from occurrences
date: 2026-09-04
decision_status: accepted
context_source: 'Fabio, 2026-09-04: "I''m still not convinced if the confidence info is
  bringing real value to the rules." Measured: 82% of 299 rules sat at 6, 7 or 8, and
  63% of confirmed rules carried a bare 6 or 8 beside a single occurrence — the value a
  harvester writes, not one a person chose.'
---
## Decision

`confidence` is removed from the frontmatter, from `check`, from the review card and the Rules table, from queue and compile ordering, and from the compiled skill line. The two exports that need a number derive one: `weight(d) = min(1, 0.5 + occurrences × 0.1)`. The hard-rules filter for `design-brain-check` loses its `confidence >= 8` escape hatch and keeps the honest half — confirmed, `always` or `never`, not client-scoped.

## Why

Three fields already answered the question confidence claimed to answer: `status` says whether the designer stands behind a rule, `occurrences` says how much evidence there is, `stance` says how hard it binds. Confidence was a fourth axis that had stopped varying, and the compiled skill introduced it to the agent as "the designer's confidence" — a claim of human judgement over a number a script had written.

## Alternatives rejected

Make it human-only, so a value means someone set it deliberately: keeps a field that would be absent on nearly every rule, and still needs a derived default for exports. Keep it and fix only the wording: leaves a column that does not discriminate.

## Consequences

299 rule files and the 139-file seed pack lose a line; `check`, the ledger, the card, the table, the compiler and five test files follow. `taste-profile.json` and `learnings.jsonl` keep a `confidence` key, now derived, so gstack is unaffected.
