---
id: DB-c-771
title: Drawers stack at most one level; a further step replaces the drawer's content
dimension: components
scope: universal
stance: avoid
status: candidate
kind: practice
component: drawers
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://atlassian.design/components/drawer/usage — Atlassian Design System (Drawer usage)"
  - "reference:https://m3.material.io/components/side-sheets/guidelines — Material Design 3 (Side sheets guidelines)"
  - "reference:https://www.nngroup.com/articles/overuse-of-overlays/ — Nielsen Norman Group (Overuse of Overlays)"
last_seen: 2026-09-03
---
## Rule

A drawer may open one dependent surface (a confirmation modal or a picker popover) but never a second drawer beside or over itself.

Navigating deeper from a drawer swaps its body and shows a back affordance in the drawer header, or leaves the drawer for a full page.

## Why

Inferred from the references: Atlassian and Material describe the drawer or side sheet as a single supplementary layer; NN/g's overlay research shows each additional layer costs orientation and makes closing unpredictable.

Confidence is moderate because the one-level cap is a synthesis of these rather than a quoted limit.

## Examples

- Atlassian — drawers are for a single layer of supplementary content; use a page for deeper flows — atlassian.design/components/drawer/usage

## Exceptions

None recorded.
