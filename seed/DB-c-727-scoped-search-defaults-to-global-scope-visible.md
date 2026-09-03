---
id: DB-c-727
title: Search defaults to the widest scope and never narrows it silently
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: search
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/scoped-search/ — Nielsen Norman Group (Scoped Search: Dangerous, but Sometimes Useful)"
  - "reference:https://baymard.com/blog/search-scope — Baymard Institute (E-Commerce Sites Need Multiple of These 5 Search Scope Features)"
last_seen: 2026-09-03
---
## Rule

A search launched from a section may pre-select that section's scope, but the scope is shown as a chip or selector next to the field and can be widened in one click. When a scoped search returns nothing, the zero-results state says which scope was searched and offers the global search with the same query. The global search is always reachable from the same field.

## Why

Inferred from the references: NN/g documents that people miss a pre-set scope and conclude the item does not exist; Baymard recommends scoping as an explicit, visible feature with an easy exit rather than a hidden default.

## Examples

- NN/g — if scope is offered, make the current scope obvious and offer to expand it when results are poor — nngroup.com/articles/scoped-search/

## Exceptions

None recorded.
