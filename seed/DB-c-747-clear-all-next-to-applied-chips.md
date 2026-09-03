---
id: DB-c-747
title: One Clear all resets every filter and sits beside the applied chips
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: filtering
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://baymard.com/blog/how-to-design-applied-filters — Baymard Institute (Filtering UX: Display Applied Filters in an Overview)"
  - "reference:https://carbondesignsystem.com/patterns/filtering/ — IBM Carbon Design System (Filtering pattern, clearing filters)"
  - "reference:https://www.nngroup.com/articles/reset-and-cancel-buttons/ — Nielsen Norman Group (Reset and Cancel Buttons)"
last_seen: 2026-09-03
---
## Rule

A single text button "Clear all" (or "Clear filters") appears at the end of the applied-chip row and removes every filter, restoring the default view and default sort.

It is hidden or disabled when nothing is applied. It never resets search text or the selected saved view unless it says so.

## Why

Inferred from the references: Baymard and Carbon both pair the applied overview with a clear-all as the fast exit from a dead end; NN/g's caution about reset buttons is why it is scoped to filters and shown only when it has something to clear.

## Examples

- Carbon — "Clear filters" action beside the applied tags; results and count return to the unfiltered state — carbondesignsystem.com/patterns/filtering/

## Exceptions

None recorded.
