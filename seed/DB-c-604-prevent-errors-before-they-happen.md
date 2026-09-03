---
id: DB-c-604
title: Prevent errors with constraints, good defaults and confirmation on risky steps
dimension: components
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/ten-usability-heuristics/ — Nielsen Norman Group (Jakob Nielsen, 10 Usability Heuristics)"
last_seen: 2026-09-03
---
## Rule

Design the input so the wrong value is hard to enter; error prevention beats error messages.

- constrain formats
- supply sensible defaults
- disable what does not apply
- ask for confirmation only where the consequence is severe

## Why

An error that cannot occur costs nothing to explain or recover from; each prevented slip removes a message, a retry and a moment of doubt.

## Examples

- A date picker instead of a free-text date field.
- "Delete project?" confirmation that names the project and the count of items it holds.

## Exceptions

Over-confirming trivial actions trains users to click through; reserve confirmation for real loss.
