---
id: DB-c-606
title: "Provide accelerators for experienced users without hiding the basic path"
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

Frequent tasks get a faster route (keyboard shortcuts, bulk actions, saved presets, type-ahead) layered on top of the visible novice path, never replacing it. Accelerators are discoverable from the slow path.

## Why

The same interface serves first-time and daily users; speed for experts should not cost clarity for newcomers.

## Examples

- A command palette that lists the same actions the menus contain, with their shortcuts shown next to each item.
- Multi-select with a "select all matching" option in a table.

## Exceptions

Public one-time flows (a checkout, a sign-up) rarely need accelerators.
