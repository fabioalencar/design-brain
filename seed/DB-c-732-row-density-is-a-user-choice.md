---
id: DB-c-732
title: "Row density is a user choice exposed on the table (compact, default, comfortable), not a per-page decision"
dimension: spacing
scope: universal
stance: prefer
status: candidate
kind: practice
component: data-tables
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, sizes)"
  - "reference:https://m2.material.io/components/data-tables — Material Design 2 (Data tables, density)"
last_seen: 2026-09-03
---
## Rule

The shared table component ships with a fixed set of row heights and a density control (in the table toolbar or the view settings) whose choice persists per user and per view. Pages do not invent their own row heights; the default density is set once for the product.

## Why

Inferred from the references: Carbon defines row sizes as a table-level option and Material specifies a density toggle so people who scan many rows can tighten the grid while others keep it readable.

## Examples

- Carbon — data table available in xs, sm, md, lg, xl row heights, chosen by content and user preference — carbondesignsystem.com/components/data-table/usage/

## Exceptions

None recorded.

See also: DB-c-451
