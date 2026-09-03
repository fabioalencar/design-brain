---
id: DB-c-743
title: Sorting a set larger than one page runs on the server over the whole set
dimension: process
scope: universal
stance: always
status: candidate
kind: practice
component: sorting
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/pagination/usage/ — IBM Carbon Design System (Pagination usage)"
  - "reference:https://ui-patterns.com/patterns/SortByColumn — ui-patterns.com (Sort By Column pattern)"
  - "reference:https://www.nngroup.com/articles/data-tables/ — Nielsen Norman Group (Data Tables: Four Major User Tasks)"
last_seen: 2026-09-03
---
## Rule

If a table is paginated or lazily loaded, a sort request goes back to the data source and returns page one of the newly ordered set.

Client-side sorting is only acceptable when the entire set is in memory, and the table states that ("Showing all 87"). Sorting only the visible page produces a wrong answer that looks right.

## Why

Inferred from the references: the sort-by-column pattern and Carbon's paginated tables both assume the order applies to the full collection; NN/g's compare task fails when the top of the list is only the top of the loaded page.

Confidence is moderate because the rule is implicit in the references rather than stated.

## Examples

- ui-patterns — Sort By Column: reorder the whole data set by the chosen column, keep the indicator visible — ui-patterns.com/patterns/SortByColumn

## Exceptions

None recorded.
