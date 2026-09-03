---
id: DB-c-770
title: Drawers open from the trailing edge in fixed widths, never full-width on desktop
dimension: layout
scope: universal
stance: always
status: candidate
kind: practice
component: drawers
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://atlassian.design/components/drawer/usage — Atlassian Design System (Drawer usage, widths)"
  - "reference:https://m3.material.io/components/side-sheets/guidelines — Material Design 3 (Side sheets guidelines, specs)"
  - "reference:https://m2.material.io/components/sheets-side — Material Design 2 (Sheets: side)"
last_seen: 2026-09-03
---
## Rule

A detail drawer opens from the right (trailing) edge with a narrow, medium or wide width defined once by the system, leaving a visible strip of the page it sits over.

Navigation drawers, by contrast, come from the leading edge. A drawer never takes the full width on desktop; on mobile it may become a full-screen sheet with a visible back control.

## Why

Inferred from the references: Atlassian defines drawer widths as a fixed set and Material fixes side sheet widths with the page remaining visible, because the visible remainder is what tells the person they have not left the page.

## Examples

- Atlassian — drawer widths narrow, medium, wide, extended, full; opens from the left or right edge — atlassian.design/components/drawer/usage

## Exceptions

None recorded.
