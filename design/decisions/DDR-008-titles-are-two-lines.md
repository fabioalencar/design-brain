---
type: Decision
id: DDR-008
title: A title is one sentence of at most 80 characters; detail lives in the rule body
date: 2026-09-03
decision_status: accepted
context_source: 'Fabio, 2026-09-03, reviewing cards: "An item title should be only 2 lines,
  can we make a rule to name each item with only 2 lines to be a better read?
  details should be below not on the title".'
---
## Decision

Every candidate, decision, and pattern title is one sentence of at most 80 characters, which is two lines at the review card's title size. Qualifiers, mechanisms, and examples move into the Rule section. The validator rejects longer titles; templates state the limit.

## Why

Titles were carrying the whole rule (up to 200 characters), which made the queue slow to scan and pushed the card body down. A title that names the rule and a body that explains it read faster and compile into shorter skill lines.

## Alternatives rejected

Clamp titles visually in the app: hides information instead of moving it, and the compiled skill would still carry the long title. A soft warning instead of an error: the ledger already has 300 entries; a rule that is not enforced is not a rule.

## Consequences

All existing titles over 80 characters are rewritten once (inbox, decisions, patterns, and the seed pack). Confirmed decisions get wording-only title edits.
