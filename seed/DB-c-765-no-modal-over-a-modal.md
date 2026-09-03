---
id: DB-c-765
title: No modal opens on top of a modal; a second step replaces the content in place
dimension: components
scope: universal
stance: never
status: candidate
kind: practice
component: modals
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/modal/usage/ — IBM Carbon Design System (Modal usage)"
  - "reference:https://atlassian.design/components/modal-dialog/usage — Atlassian Design System (Modal dialog usage)"
  - "reference:https://m3.material.io/components/dialogs/guidelines — Material Design 3 (Dialogs guidelines)"
last_seen: 2026-09-03
---
## Rule

A flow that needs a second dialog is redesigned: the modal's body swaps to the next step with a back control, the confirmation happens inline inside the same modal, or the whole task becomes a page or drawer. Stacked modals break focus management, dimming and the Escape contract.

## Why

Inferred from the references: Carbon, Atlassian and Material all advise against stacking dialogs and recommend a page or a multi-step dialog instead, because a second layer hides the first and leaves people unsure which one Escape will close.

## Examples

- Atlassian — avoid opening a modal from a modal; if a task has several steps, consider a page or a multi-step flow — atlassian.design/components/modal-dialog/usage

## Exceptions

None recorded.
