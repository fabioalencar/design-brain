---
id: DB-c-741
title: "Sorting is stable: ties keep a declared secondary order and never reshuffle"
dimension: process
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: sorting
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort — MDN Web Docs (Array.prototype.sort, sort stability)"
  - "reference:https://www.nngroup.com/articles/data-tables/ — Nielsen Norman Group (Data Tables: Four Major User Tasks)"
last_seen: 2026-09-03
---
## Rule

Every sortable view names its tie-breaker (usually the default order, then a unique id) and applies it on the client and the server alike.

Two rows with the same status or date then appear in the same relative order every time and on every page; a person who re-sorts, refreshes or paginates never sees equal rows swap places.

## Why

Inferred from the references: modern JavaScript guarantees a stable sort, but server queries do not unless an explicit secondary key is given, and unstable ordering across page boundaries produces duplicated and skipped rows. NN/g's find-and-compare tasks require the order to be predictable.

Confidence is moderate because this is engineering guidance rather than a published design rule.

## Examples

- MDN — Array.prototype.sort is stable since ES2019; equal elements retain their original order — developer.mozilla.org

## Exceptions

None recorded.
