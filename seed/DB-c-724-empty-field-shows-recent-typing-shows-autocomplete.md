---
id: DB-c-724
title: An empty search field shows recent queries; typing shows query autocomplete
dimension: components
scope: universal
stance: prefer
status: candidate
kind: practice
component: search
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/site-search-suggestions/ — Nielsen Norman Group (Site Search Suggestions)"
  - "reference:https://baymard.com/blog/autocomplete-design — Baymard Institute (9 UX Best Practice Design Patterns for Autocomplete Suggestions)"
  - "reference:https://m3.material.io/components/search/guidelines — Material Design 3 (Search guidelines)"
last_seen: 2026-09-03
---
## Rule

On focus with nothing typed, the dropdown lists the person's recent searches (removable) and a few suggested queries. While typing, it shows a short list of query completions with the typed part visually distinguished, optionally with a few direct entity hits in a separate group. Suggestions are limited to roughly ten, keyboard-navigable, and never replace the typed text until chosen.

## Why

Inferred from the references: NN/g and Baymard both find that query suggestions reduce typing, typos and zero-result searches, and that mixing suggestions and results without grouping confuses; Material specifies recent items in the search view before input.

## Examples

- Baymard — highlight the differences between the typed text and the suggestion, keep the list under ten, allow keyboard navigation — baymard.com/blog/autocomplete-design
- Material 3 — search view shows recent searches and suggestions before typing — m3.material.io/components/search/guidelines

## Exceptions

None recorded.
