---
id: DB-c-600
title: "Keep users informed of system status with timely feedback"
dimension: components
scope: universal
stance: always
status: candidate
source: heuristic
kind: heuristic
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/ten-usability-heuristics/ — Nielsen Norman Group (Jakob Nielsen, 10 Usability Heuristics)"
last_seen: 2026-09-03
---
## Rule

Every action the user takes gets a visible response within a beat: a pressed state, a spinner, a progress indicator, a confirmation.

The interface never leaves the user guessing whether something happened or is still happening.

## Why

Without feedback the user cannot tell success from failure and repeats or abandons the action. Predictable feedback builds the trust that lets them act without hesitation.

## Examples

- A "Save" button that shows a pressed state, then "Saved" for a moment, then returns to rest.
- A multi-step upload that shows a percentage and the file being processed, not a bare spinner.

## Exceptions

Instantaneous actions (under roughly 100 ms) need no progress indicator; a state change is enough.
