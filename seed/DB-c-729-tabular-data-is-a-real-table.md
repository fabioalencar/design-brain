---
id: DB-c-729
title: "Tabular data is rendered as a real table with a header row; a grid of cards is not a substitute"
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: data-tables
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/data-tables/ — Nielsen Norman Group (Data Tables: Four Major User Tasks)"
  - "reference:https://www.smashingmagazine.com/2019/01/table-design-patterns-web/ — Smashing Magazine (Table Design Patterns On The Web)"
  - "reference:https://inclusive-components.design/data-tables/ — Inclusive Components, Heydon Pickering (Data Tables)"
last_seen: 2026-09-03
---
## Rule

Records with the same fields are shown as rows under a single header row, using table semantics (table, th, scope) so columns can be scanned, compared and sorted. Cards are for heterogeneous items where the image or summary is the point; they are not used to present rows of identical fields.

## Why

Inferred from the references: NN/g lists finding, comparing, viewing and acting on records as the table's jobs, which need aligned columns; Smashing and Inclusive Components document that header semantics are what make the data navigable by keyboard and screen reader.

## Examples

- NN/g — tables exist so users can find a record, compare values across records, and act on rows — nngroup.com/articles/data-tables/

## Exceptions

None recorded.

See also: DB-021
