---
id: DB-c-745
title: Applied filters are listed as removable chips above the results
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: filtering
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://baymard.com/blog/how-to-design-applied-filters — Baymard Institute (Filtering UX: Display Applied Filters in an Overview)"
  - "reference:https://carbondesignsystem.com/patterns/filtering/ — IBM Carbon Design System (Filtering pattern, applied filters)"
  - "reference:https://m3.material.io/components/chips/guidelines — Material Design 3 (Chips guidelines, filter chips)"
last_seen: 2026-09-03
---
## Rule

Every active filter is echoed as a chip ("Status: Open", "Owner: Ana") in a row between the filter controls and the results, and each chip has a remove control that lifts that one filter.

The chip row is the one place a person can see the whole applied set regardless of where the filters were set.

## Why

Inferred from the references: Baymard finds that without an overview people forget which filters are on and misread the result set as the whole; Carbon's pattern and Material's filter chips both specify the removable chip as the applied-filter summary.

## Examples

- Baymard — show applied filters in one overview near the results, each removable — baymard.com/blog/how-to-design-applied-filters

## Exceptions

None recorded.

See also: DB-c-416
