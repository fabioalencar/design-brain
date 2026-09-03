---
id: DB-c-612
title: "Chunk content into small groups; do not make users hold more than a few items in memory"
dimension: layout
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://lawsofux.com/millers-law/ — Laws of UX, Miller's Law"
last_seen: 2026-09-03
---
## Rule

Long strings and lists are broken into labelled groups of a few items. Anything the user must carry from one step to the next is shown again rather than remembered.

## Why

Working memory holds only a handful of chunks; grouping turns many items into few and reduces slips.

## Examples

- A card number entered in groups of four digits.
- A settings page organised into named sections rather than one long list.

## Exceptions

The number itself is not a target: the rule is chunking, not "seven items per menu".
