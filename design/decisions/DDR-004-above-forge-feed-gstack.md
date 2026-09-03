---
type: Decision
id: DDR-004
title: design-brain sits above Forge and feeds gstack instead of replacing either
date: 2026-09-02
decision_status: draft
context_source: "Survey during planning 2026-09-02: Forge already records per-project DDRs and
  craft patterns; gstack already reads a taste-profile.json that had never been
  populated."
---
## Decision

Per-project design decisions stay in Forge DDRs. design-brain harvests DDRs, gstack audits, transcripts, and repo artifacts into one cross-project ledger, and exports confirmed decisions to gstack's taste-profile.json and learnings.jsonl formats so design-consultation and design-review honour them. The DB-### id namespace is distinct from DDR-### and the two kinds of decisions live in different directories (decisions/ vs design/decisions/).

## Why

Both tools already exist on this machine and already have the right hooks: Forge has the decision discipline, gstack has an empty taste mechanism and a cross_project_learnings flag. Building a third store that competes with them would split the record; building the aggregation layer they lack is the smallest thing that closes the loop.

## Alternatives rejected

Extend gstack's taste-profile directly as the ledger — its schema holds approved/rejected values, not rules with evidence and scope. Put cross-project rules into Forge's global patterns catalog — patterns are universal craft by Forge's own `DDR-027` (in the Forge record, not this one); taste is not.

## Consequences

Two decision directories in this repo, which the glossary explains. Exports are generated but not installed until TASK-005. Forge could later cite DB decisions the way it cites patterns.
