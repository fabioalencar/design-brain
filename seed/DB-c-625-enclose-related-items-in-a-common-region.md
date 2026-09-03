---
id: DB-c-625
title: "Enclose related items in a shared region when spacing alone cannot group them"
dimension: layout
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://lawsofux.com/law-of-common-region/ — Laws of UX, Law of Common Region"
last_seen: 2026-09-03
---
## Rule

A shared background, border or container reads as one group and separates it from its surroundings. Use it for groups that must be distinct from dense neighbours; do not wrap everything, or the regions stop meaning anything.

## Why

A boundary is a stronger grouping cue than proximity and overrides it, which is useful when space is tight and harmful when applied by default.

## Examples

- A card grouping an item's image, title, price and button.
- A subtle background band that separates a filter row from a results table.

## Exceptions

If the design rule forbids decorative borders, group by background tone or spacing instead.
