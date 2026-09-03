---
id: DB-c-748
title: "Filter options that would return zero results are shown disabled with their count, not removed from the list"
dimension: components
scope: universal
stance: prefer
status: candidate
kind: practice
component: filtering
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/filter-categories-values/ — Nielsen Norman Group (Helpful Filter Categories and Values for Better UX)"
  - "reference:https://www.nngroup.com/articles/filters-vs-facets/ — Nielsen Norman Group (Filters vs. Facets)"
  - "reference:https://carbondesignsystem.com/patterns/filtering/ — IBM Carbon Design System (Filtering pattern)"
last_seen: 2026-09-03
---
## Rule

Each filter value shows the number of results it currently yields, and a value whose count has dropped to zero stays in place, greyed and unselectable, so the list keeps a constant shape and people can see that the option exists but is excluded by the current combination. Values disappear only when the underlying data has none at all.

## Why

Inferred from the references: NN/g's guidance on filter values recommends counts per value and warns against options that vanish and reappear, which makes the panel feel unreliable; Carbon keeps filter controls stable across states. Confidence is moderate because the disabled-rather-than-hidden rule is an inference from those pages.

## Examples

- NN/g — show how many results each filter value will produce; keep the set of values predictable — nngroup.com/articles/filter-categories-values/

## Exceptions

None recorded.

See also: DB-c-508, DB-c-513
