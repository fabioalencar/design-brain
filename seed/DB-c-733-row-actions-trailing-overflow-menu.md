---
id: DB-c-733
title: Row actions live in a trailing overflow menu, with at most one exposed inline
dimension: components
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: data-tables
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, overflow menu)"
  - "reference:https://polaris.shopify.com/components/tables/index-table — Shopify Polaris (Index table)"
  - "reference:https://www.nngroup.com/articles/data-tables/ — Nielsen Norman Group (Data Tables: Four Major User Tasks)"
last_seen: 2026-09-03
---
## Rule

Per-row actions are collected in an overflow (kebab) menu in the last column so the row stays scannable.

If one action is used far more than the others (open, approve), it may be exposed as an inline icon button or made the row-click target, but never more than one. Destructive actions sit last in the menu, separated.

## Why

Inferred from the references: Carbon places row actions in a trailing overflow menu to keep columns aligned; NN/g's table tasks include acting on a row, which needs a predictable location rather than a different button set per page.

## Examples

- Carbon — overflow menu in the last column, revealed on hover and focus, always reachable by keyboard — carbondesignsystem.com/components/data-table/usage/

## Exceptions

None recorded.

See also: DB-c-540
