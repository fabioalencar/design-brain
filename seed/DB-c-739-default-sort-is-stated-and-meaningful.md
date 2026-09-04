---
id: DB-c-739
title: The default sort of a list is meaningful and visible, never database order
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: sorting
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://baymard.com/blog/default-sort-type — Baymard Institute (Always Sort Product Lists by Diversity-Based Relevance)"
  - "reference:https://www.nngroup.com/articles/data-tables/ — Nielsen Norman Group (Data Tables: Four Major User Tasks)"
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, sorting)"
last_seen: 2026-09-03
---
## Rule

Every table or list ships with a declared default order chosen for the view's job (newest first for activity, needs-attention first for queues, alphabetical for reference lists).

The sorted column shows its indicator on first load so the order is legible. "Whatever the query returned" is not a default.

## Why

Inferred from the references:

- Baymard finds that the first sort a person sees shapes whether they trust the list at all
- NN/g's table tasks (find, compare) depend on an order the person can predict
- Carbon's sorted-by-default state exists for this

## Examples

- Baymard — the default order must reflect what the person most likely wants; relevance for search, recency or priority for work lists — baymard.com/blog/default-sort-type

## Exceptions

None recorded.

See also: DB-c-550, DB-020
