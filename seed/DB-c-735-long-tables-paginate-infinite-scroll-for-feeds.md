---
id: DB-c-735
title: "Long tables paginate with a stated page size and total; infinite scroll is reserved for feeds"
dimension: components
scope: universal
stance: prefer
status: candidate
kind: practice
component: data-tables
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/infinite-scrolling/ — Nielsen Norman Group (Infinite Scrolling Is Not for Every Website)"
  - "reference:https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/ — Smashing Magazine (Infinite Scrolling, Pagination Or Load-More Buttons?)"
  - "reference:https://carbondesignsystem.com/components/pagination/usage/ — IBM Carbon Design System (Pagination usage)"
last_seen: 2026-09-03
---
## Rule

A table of records shows a pagination control with the current range ("1–50 of 1,204"), a page-size choice, and previous/next, so people can reach the footer, bookmark a page, and reason about how much there is. Infinite scroll is used only for time-ordered feeds where reaching the end is not a goal.

## Why

Inferred from the references: NN/g and Smashing both find infinite scroll harms goal-directed tasks (finding a specific record, returning to a position, reaching a footer) while suiting browsing feeds; Carbon's pagination component is the default for its data tables.

## Examples

- Carbon — pagination with items per page, current range and total, placed under the table — carbondesignsystem.com/components/pagination/usage/

## Exceptions

None recorded.
