---
id: DB-c-610
title: "Size and place interactive targets by frequency and distance so they are easy to hit"
dimension: layout
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://lawsofux.com/fittss-law/ — Laws of UX (Jon Yablonski), Fitts's Law"
last_seen: 2026-09-03
---
## Rule

Targets used most are largest and closest to where the pointer or thumb already is; targets that must not be hit by accident are smaller or further away. Padding counts toward the target, so the whole row or card is clickable when it looks clickable.

## Why

Time to hit a target grows with distance and shrinks with size; small far-away buttons cost time and cause misses.

## Examples

- Primary action at the bottom of a mobile sheet, within thumb reach.
- Table row that is clickable across its whole width, not only on the name.

## Exceptions

Destructive actions are deliberately separated from safe ones even at a cost in speed.
