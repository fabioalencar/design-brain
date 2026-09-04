---
id: DB-c-726
title: "Zero results is a designed state: keep the query editable and offer recovery"
dimension: copy
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: search
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/search-no-results-serp/ — Nielsen Norman Group (3 Guidelines for Search Engine No Results Pages)"
  - "reference:https://baymard.com/blog/no-results-page — Baymard Institute (5 Proven UX Strategies For No Results Pages)"
  - "reference:https://carbondesignsystem.com/patterns/empty-states-pattern/ — IBM Carbon Design System (Empty states pattern, no search results)"
last_seen: 2026-09-03
---
## Rule

The no-results view repeats the query, keeps it in the field for editing, and states plainly that nothing matched it.

It then offers concrete ways out:

- a spelling correction
- removing active filters or narrowing scope
- a broader query
- a link to browse

It never shows an unrelated set of items as if they were results, and never a blank area.

## Why

Inferred from the references: NN/g and Baymard find that the no-results page is where people abandon unless it explains and offers alternatives; Carbon defines the no-search-results empty state as a distinct variant with recovery actions.

## Examples

- Baymard — show the query, suggest spelling fixes, offer to clear filters, provide category links — baymard.com/blog/no-results-page

## Exceptions

None recorded.

See also: DB-c-214
