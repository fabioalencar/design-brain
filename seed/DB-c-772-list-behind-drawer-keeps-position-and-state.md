---
id: DB-c-772
title: The list behind a drawer keeps its scroll position, selection, sort and filters
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: drawers
occurrences: [reference]
evidence:
  - "reference:https://m3.material.io/components/side-sheets/guidelines — Material Design 3 (Side sheets guidelines)"
  - "reference:https://www.nngroup.com/articles/user-control-and-freedom/ — Nielsen Norman Group (User Control and Freedom)"
  - "reference:https://www.nngroup.com/articles/visibility-system-status/ — Nielsen Norman Group (Visibility of System Status)"
last_seen: 2026-09-03
---
## Rule

Opening a drawer must not re-fetch or re-render the list underneath in a way that loses scroll, expanded rows, checked rows or the active filters.

The row the drawer represents stays highlighted while it is open. When the drawer's edit is saved, the row updates in place and the list does not jump.

This is the reason to choose a drawer over a page, so violating it removes the benefit.

## Why

Inferred from the references: Material's side sheet keeps the main content in place and in view by definition; NN/g's control-and-freedom and status heuristics require that the person's place and their prior choices are preserved across the interruption.

## Examples

- Material 3 — side sheet content is supplementary; the primary content stays visible and retains state — m3.material.io/components/side-sheets/guidelines

## Exceptions

None recorded.
