---
id: DB-c-618
title: "Irreducible complexity is absorbed by the system, not pushed onto the user"
dimension: process
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://lawsofux.com/teslers-law/ — Laws of UX, Tesler's Law"
last_seen: 2026-09-03
---
## Rule

When a task has complexity that cannot be removed, the product carries it: smart defaults, inference, pre-filled data, sensible fallbacks. The user is asked only for what only they know.

## Why

Every process has a floor of complexity; the design decision is who pays for it, and the user pays with errors and drop-off.

## Examples

- Card type detected from the number, not selected from a dropdown.
- Time zone inferred from the device and shown for confirmation.

## Exceptions

Do not over-simplify past the floor; hiding required decisions creates errors later.
