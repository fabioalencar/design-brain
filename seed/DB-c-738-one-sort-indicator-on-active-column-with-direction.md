---
id: DB-c-738
title: Only the active sort column shows an indicator, and it shows direction
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: sorting
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, sorting)"
  - "reference:https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/ — W3C WAI (ARIA Authoring Practices, Sortable Table example)"
  - "reference:https://ui-patterns.com/patterns/SortByColumn — ui-patterns.com (Sort By Column pattern)"
last_seen: 2026-09-03
---
## Rule

One column at a time carries a visible up or down arrow and the aria-sort attribute; other sortable headers show a muted arrow only on hover or keyboard focus so the table does not fill with chevrons.

The header is a button, so it is clickable and focusable across its full width.

## Why

Inferred from the references: Carbon's sorting states (unsorted, ascending, descending) show the arrow only on the sorted column and on hover for others; the ARIA sortable table example sets aria-sort on exactly one header and uses a button inside the header cell.

## Examples

- ARIA APG — sortable table: one th has aria-sort=ascending or descending; the rest have none — w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/

## Exceptions

Multi-column sort, when offered, shows a numbered indicator on each participating column.
