---
id: DB-c-777
title: Related records on a details page are compact tables linking to the full list
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: details-page
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://polaris.shopify.com/patterns/resource-details — Shopify Polaris (Resource details layout pattern)"
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage)"
  - "reference:https://www.nngroup.com/articles/data-tables/ — Nielsen Norman Group (Data Tables: Four Major User Tasks)"
last_seen: 2026-09-03
---
## Rule

Children and siblings of the record (line items, contacts, linked tickets) are shown as a small table with the same columns and behaviour as the main list for that type.

The table is capped at a handful of rows, with a "View all N" link that opens the full list already filtered to this record. They are not shown as card piles or comma-separated names.

## Why

Inferred from the references:

- NN/g's table tasks apply to related records just as to top-level lists
- Polaris's resource details layout embeds related resources as lists with a path to their index
- Carbon's data table is designed to be reused at small sizes for this

## Examples

- Polaris — related resources shown inside the details page as a list, linking to the full index filtered by the parent — polaris.shopify.com/patterns/resource-details

## Exceptions

None recorded.

See also: DB-021
