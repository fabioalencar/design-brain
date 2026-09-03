---
type: Decision
id: DDR-006
title: Published heuristics and known biases enter the ledger as standalone candidates
date: 2026-09-03
decision_status: draft
context_source: 'Fabio, 2026-09-03: "Known heuristics can be part of the project as sole
  items. Add known biases as things to be avoided. You can add it on the queue
  as items for me to decide."'
---
## Decision

The ledger accepts two kinds of candidate that are not harvested from the designer's own work: `kind: heuristic` (an established usability heuristic adopted as a standing check) and `kind: bias` (a cognitive bias the interface must not exploit, or a bias the designer must not fall into, recorded as something to avoid). Their evidence is a `reference:` line naming the published source. They go through the same queue and the same promote/retire verdicts, and compile into their own sections of the skills, separate from harvested rules. Ids 600–649 are heuristics, 650–699 biases.

## Why

Some of what a designer wants an agent to apply by default was never decided in a project; it is craft knowledge from the field. Keeping it out of the ledger would make the skill incomplete; mixing it with harvested rules would hide which rules have the designer's own evidence behind them. A separate kind keeps both visible and lets the designer decide which references they actually stand behind.

## Alternatives rejected

Bake a fixed heuristics list into the compiler — not decidable, not retirable, and every designer would get the same list. Treat references as evidence for harvested rules only — loses heuristics the projects never touched.

## Consequences

check.ts validates `kind` and requires a `reference:` line for heuristic and bias entries. The compiler renders them under 'Reference heuristics' and 'Biases and manipulative patterns to avoid', and design-brain-check flags biases on sight. Entries are written in original words with attribution links; no source text is reproduced.

## Addendum 2026-09-03 — component practices

Same day, Fabio added a third reference kind: `kind: practice`, a good practice for a common component or use case (notifications, user profile, settings, tooltips, search, data tables, sorting, filtering, highlight cards, progressive disclosure, modals, drawers, details page), tagged with `component:` and compiled under a per-component section. Ids 700–799. This is the first concrete answer to QUESTION-007 (organise by component as well as dimension).
