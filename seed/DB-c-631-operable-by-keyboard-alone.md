---
id: DB-c-631
title: "Every function is operable by keyboard alone, with visible focus and no trap"
dimension: components
scope: universal
stance: always
status: candidate
source: heuristic
kind: heuristic
occurrences: [reference]
evidence:
  - "reference:https://www.w3.org/TR/WCAG22/#keyboard-accessible — W3C, WCAG 2.2 Guideline 2.1 Keyboard Accessible and SC 2.4.7 Focus Visible"
last_seen: 2026-09-03
---
## Rule

Everything a pointer can do, Tab, Shift+Tab, Enter, Space, Escape and the arrow keys can do.

- focus order follows reading order
- the focused element is always visibly marked
- focus can never get stuck inside a component

## Why

Keyboard operation is the common path for screen-reader, switch and motor-impaired users, and also for power users; a control that only a mouse can reach excludes them all.

## Examples

- A custom dropdown that opens on Enter, moves with arrows, selects on Enter, closes on Escape and returns focus to its trigger.
- A modal that traps focus while open and releases it on close.

## Exceptions

Freehand input (drawing) may need a pointer, provided an equivalent path exists for the outcome.
