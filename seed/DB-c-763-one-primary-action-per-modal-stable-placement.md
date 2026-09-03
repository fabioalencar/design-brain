---
id: DB-c-763
title: A modal has one primary action in a fixed position and a plain secondary
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: modals
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/ok-cancel-or-cancel-ok/ — Nielsen Norman Group (OK-Cancel or Cancel-OK? The Trouble With Buttons)"
  - "reference:https://carbondesignsystem.com/components/modal/usage/ — IBM Carbon Design System (Modal usage, actions)"
  - "reference:https://atlassian.design/components/modal-dialog/usage — Atlassian Design System (Modal dialog usage)"
  - "reference:https://m3.material.io/components/dialogs/guidelines — Material Design 3 (Dialogs guidelines)"
last_seen: 2026-09-03
---
## Rule

The footer holds at most two buttons: one filled primary that names the outcome ("Delete project", "Send invoice"), and one secondary "Cancel".

The primary always sits in the same corner across the product. A destructive primary uses the destructive colour and its label repeats the verb, never "OK" or "Yes". Three-button modals are split into two decisions.

## Why

Inferred from the references: NN/g's button-order research asks for consistency above all and for specific verbs on the primary; Carbon, Atlassian and Material each specify a single primary, a secondary, and the destructive variant.

## Examples

- Carbon — modal footer: primary and secondary buttons, primary on the right, danger variant for destructive — carbondesignsystem.com/components/modal/usage/
- Material 3 — dialog with a confirming action and a dismissive action, no more — m3.material.io/components/dialogs/guidelines

## Exceptions

None recorded.
