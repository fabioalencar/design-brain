---
type: Decision
id: DDR-012
title: The verb that produces a state shares its stem; each review state has one word
date: 2026-09-04
decision_status: accepted
context_source: 'Fabio, 2026-09-04: "We use confirmed and promote for the same context.
  How can we create a standard copy for the action and status?" The action was Promote,
  the state it produced was confirmed, and the state before a verdict was called
  candidate, "in review" and "in queue" in three different places.'
---
## Decision

The action that produces a state shares a stem with it, and each state is named once. `retire` → `retired` already obeyed this; `promote` → `confirmed` did not. The verb is renamed **confirm** everywhere — swipe button, stamp, bulk action, drawer action, API verdict, ledger method, CLI command — to match the `confirmed` status. `promote` survives as a CLI alias. The stage before a verdict is **in review** in the chip, the filter and the counter alike.

## Why

Two names for one transition is a translation the reader performs on every card, and it leaks: the counter said "81 promoted" while the filter beside it said "confirmed". Renaming the verb rather than the status is the cheap direction — the status value is in 299 rule files, the compile guards and this record, while the verb lives only in code the tool ships.

## Alternatives rejected

Rename the status to `promoted`: same consistency, but it rewrites the status line in every rule file and the seed pack, and `confirm` is the truer verb — the designer is confirming a rule they already wrote, not raising its rank. Change the visible copy only: leaves the drift one layer down, which is where it started.

## Consequences

`ledger.confirm()`, verdict actions `confirm` / `unconfirm`, `design-brain confirm`. The `promoted:` date stamp in the 81 confirmed files keeps its key for now — the only remaining place the old word survives.
