---
id: DB-c-756
title: At most one row of stat cards sits at the top of a page; more become a table
dimension: layout
scope: universal
stance: avoid
status: candidate
kind: practice
component: highlight-cards
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/dashboards-preattentive/ — Nielsen Norman Group (Dashboards: Making Charts and Graphs Easier to Understand)"
  - "reference:https://ui-patterns.com/patterns/dashboard — ui-patterns.com (Dashboard pattern)"
last_seen: 2026-09-03
---
## Rule

A page shows the three to five numbers that decide what to do next as one row of equal-width cards above the working content. If more numbers are needed, they belong in a metrics table with columns for value, change and window, where alignment carries the comparison. Stacking rows of cards turns a summary into a wall.

## Why

Inferred from the references: NN/g's dashboard guidance argues for a small number of prioritised values and for tables when the reader must compare many; the dashboard pattern warns against widget sprawl.

## Examples

- NN/g — limit what is on the dashboard to what supports the decision; more tiles means less attention per tile — nngroup.com/articles/dashboards-preattentive/

## Exceptions

None recorded.

See also: DB-021, DB-c-451
