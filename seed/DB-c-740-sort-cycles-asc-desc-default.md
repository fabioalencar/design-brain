---
id: DB-c-740
title: A sortable header cycles ascending, descending, then back to the default order
dimension: components
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: sorting
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/data-table/usage/ — IBM Carbon Design System (Data table usage, sorting states)"
  - "reference:https://m2.material.io/components/data-tables — Material Design 2 (Data tables, sorting)"
last_seen: 2026-09-03
---
## Rule

A sortable header has three states: first click sorts ascending (A to Z, oldest, smallest), second descending, third returns the table to its declared default order and removes the indicator.

Text columns start ascending; date and numeric columns may start descending when the newest or largest is what people look for, as long as the choice is consistent per type.

## Why

Inferred from the references: Carbon defines unsorted, ascending and descending as the three header states and returns to unsorted on the third activation, so the curated default is always one click away instead of requiring a reload.

## Examples

- Carbon — sort states: none, ascending, descending; the third click restores the unsorted (default) order — carbondesignsystem.com/components/data-table/usage/

## Exceptions

None recorded.

See also: DB-c-550
