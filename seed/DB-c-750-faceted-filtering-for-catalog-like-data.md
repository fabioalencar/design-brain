---
id: DB-c-750
title: Catalog-like data with many items and attributes uses faceted filtering
dimension: components
scope: universal
stance: context
status: candidate
kind: practice
component: filtering
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/filters-vs-facets/ — Nielsen Norman Group (Filters vs. Facets)"
  - "reference:https://baymard.com/blog/allow-applying-of-multiple-filter-values — Baymard Institute (Filtering UX: Combining Filter Options)"
  - "reference:https://www.nngroup.com/articles/mobile-faceted-search/ — Nielsen Norman Group (Mobile Faceted Search with a Tray)"
last_seen: 2026-09-03
---
## Rule

When a collection is large and described by several independent attributes (type, status, owner, date, tag), each attribute becomes a facet listing its values with counts; values within one facet combine with OR, facets combine with AND. Small lists with one or two dimensions use simple filters or a segmented control instead. On mobile, facets open in a tray with the count on the apply button.

## Why

Inferred from the references: NN/g distinguishes facets (attribute-derived, counted, combinable) from plain filters and reserves them for large heterogeneous sets; Baymard finds that not allowing multiple values in one facet forces repeated searches.

## Examples

- Baymard — allow selecting several values within the same filter type (OR) while types combine (AND) — baymard.com/blog/allow-applying-of-multiple-filter-values

## Exceptions

None recorded.
