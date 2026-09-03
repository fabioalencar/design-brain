---
id: DB-c-736
title: "Empty, loading and sparse tables keep the same header and column set; loading shows skeleton rows, empty shows a message in the body, missing cells show one marker"
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: data-tables
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/patterns/loading-pattern/ — IBM Carbon Design System (Loading pattern)"
  - "reference:https://carbondesignsystem.com/patterns/empty-states-pattern/ — IBM Carbon Design System (Empty states pattern)"
  - "reference:https://www.nngroup.com/articles/skeleton-screens/ — Nielsen Norman Group (Skeleton Screens 101)"
last_seen: 2026-09-03
---
## Rule

The column set is defined by the view, not by the data that happened to load. While loading, the header renders and the body shows skeleton rows at the expected height; when no rows exist, the header stays and the body holds one sentence and one action; when a cell has no value, it renders the app's single empty marker rather than dropping or collapsing the column. Layout does not jump between these states.

## Why

Inferred from the references: Carbon's loading and empty-state patterns keep the table frame so orientation survives the transition; NN/g's skeleton screens shape the placeholder to the coming content to reduce perceived wait and shift.

## Examples

- Carbon — skeleton state for data table: header plus placeholder rows; empty state rendered inside the table body — carbondesignsystem.com/patterns/loading-pattern/

## Exceptions

None recorded.

See also: DB-c-542, DB-c-508, DB-c-143
