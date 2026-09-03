---
id: DB-c-730
title: "Columns align by data type: text left, numbers right with tabular figures"
dimension: typography
scope: universal
stance: always
status: candidate
kind: practice
component: data-tables
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, alignment)"
  - "reference:https://www.smashingmagazine.com/2019/01/table-design-patterns-web/ — Smashing Magazine (Table Design Patterns On The Web)"
  - "reference:https://polaris.shopify.com/components/tables/data-table — Shopify Polaris (Data table component)"
last_seen: 2026-09-03
---
## Rule

Each column aligns by its type, and the header cell takes the same alignment as the cells beneath it.

- text and identifiers align left
- quantities, amounts and percentages align right and use tabular (monospaced) figures so digits stack
- dates align left in a fixed format
- centre alignment is reserved for short fixed-width symbols such as status icons or checkboxes

## Why

Inferred from the references: Carbon and Polaris both prescribe right-aligned numbers and left-aligned text so magnitudes can be compared down a column; Smashing's table patterns add tabular figures as the typographic half of the same rule.

## Examples

- Carbon — left-align text, right-align numeric data, align header with its column — carbondesignsystem.com/components/data-table/usage/

## Exceptions

Identifier-like numbers (IDs, phone numbers, postcodes) are text and align left.

See also: DB-c-300
