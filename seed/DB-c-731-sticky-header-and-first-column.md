---
id: DB-c-731
title: Table header stays visible on scroll; wide tables pin the first column too
dimension: layout
scope: universal
stance: always
status: candidate
kind: practice
component: data-tables
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, sticky header)"
  - "reference:https://www.smashingmagazine.com/2019/01/table-design-patterns-web/ — Smashing Magazine (Table Design Patterns On The Web, fixed headers)"
  - "reference:https://m2.material.io/components/data-tables — Material Design 2 (Data tables)"
last_seen: 2026-09-03
---
## Rule

Any table taller than the viewport pins its header row so column meaning is never lost; any table wider than its container scrolls horizontally inside its own container with the row-identifying column pinned on the left. The page itself never scrolls horizontally because of a table.

## Why

Inferred from the references: Carbon offers sticky header as a standard variant for long tables; Smashing's patterns cover fixed headers and fixed first columns as the answer to losing context in long or wide tables.

## Examples

- Carbon — sticky header variant keeps column titles visible for tables that scroll — carbondesignsystem.com/components/data-table/usage/

## Exceptions

None recorded.

See also: DB-021
