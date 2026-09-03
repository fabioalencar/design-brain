---
id: DB-c-629
title: "Remove what does not serve the task; the simplest design that works wins"
dimension: layout
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://lawsofux.com/occams-razor/ — Laws of UX, Occam's Razor"
last_seen: 2026-09-03
---
## Rule

Between two designs that achieve the same result, choose the one with fewer elements, states and rules. Review each element by asking what breaks if it is removed; if nothing, remove it.

## Why

Every element is a cost in attention, maintenance and consistency; complexity should have to justify itself.

## Examples

- A single search field instead of an advanced-search form nobody uses.
- Dropping a secondary navigation that duplicates the primary one.

## Exceptions

Do not confuse simple-looking with simple: hiding necessary controls behind gestures shifts complexity rather than removing it.
