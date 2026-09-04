---
id: DB-c-769
title: A drawer is for one item viewed or edited while the list stays in view
dimension: components
scope: universal
stance: context
status: candidate
source: practice
kind: practice
component: drawers
occurrences: [reference]
evidence:
  - "reference:https://atlassian.design/components/drawer/usage — Atlassian Design System (Drawer usage)"
  - "reference:https://m3.material.io/components/side-sheets/guidelines — Material Design 3 (Side sheets guidelines)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/panels — Apple Human Interface Guidelines (Panels)"
last_seen: 2026-09-03
---
## Rule

Use a drawer when the person needs the context of the underlying page (the list, the map, the board) while looking at or changing one thing; a drawer also serves secondary flows that return to where they started.

Typical cases: previewing a row, quick-editing fields, a filter tray, a short create form.

Use a page instead when the item has its own navigation, many sections or an audit trail, and a modal only for a blocking decision.

## Why

Inferred from the references: Atlassian's drawer and Material's side sheet are both described as supplementary surfaces that keep the primary content visible and interactive; Apple's panels hold auxiliary content alongside the main window.

## Examples

- Material 3 — side sheets show supplementary content and actions anchored to the main content — m3.material.io/components/side-sheets/guidelines

## Exceptions

None recorded.
