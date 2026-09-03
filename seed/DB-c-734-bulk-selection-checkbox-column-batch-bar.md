---
id: DB-c-734
title: Bulk selection uses a leading checkbox column, header select-all and a batch bar
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: data-tables
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, batch actions)"
  - "reference:https://polaris.shopify.com/components/tables/index-table — Shopify Polaris (Index table, bulk actions)"
  - "reference:https://atlassian.design/components/dynamic-table/usage — Atlassian Design System (Dynamic table usage)"
last_seen: 2026-09-03
---
## Rule

When rows can be acted on together, the first column is a checkbox and selecting anything reveals a batch action bar.

The header checkbox selects or clears the visible page and shows an indeterminate state for partial selection. The batch action bar reads "N selected" with the available actions and a cancel.

Selecting across pages is an explicit extra step ("Select all 1,204"), never implicit.

## Why

Inferred from the references: Carbon's batch action variant and Polaris's index table both define this exact assembly, including the count and the explicit all-pages selection, because silent cross-page selection causes destructive mistakes.

## Examples

- Carbon — batch actions bar replaces the table toolbar when rows are selected and shows the count — carbondesignsystem.com/components/data-table/usage/

## Exceptions

None recorded.
