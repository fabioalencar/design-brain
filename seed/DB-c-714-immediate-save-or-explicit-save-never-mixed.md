---
id: DB-c-714
title: A settings page saves each control immediately or has one Save, never both
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: settings
occurrences: [reference]
evidence:
  - "reference:https://m3.material.io/components/switch/guidelines — Material Design 3 (Switch guidelines)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/toggles — Apple Human Interface Guidelines (Toggles)"
  - "reference:https://polaris.shopify.com/components/deprecated/contextual-save-bar — Shopify Polaris (Contextual save bar)"
last_seen: 2026-09-03
---
## Rule

A page never mixes immediate save and explicit save: a person must not have to guess which controls needed the button.

Toggles and single-choice controls that take effect on their own save immediately and confirm with a brief inline state ("Saved" or the control's new position is enough).

Pages built from text fields and related choices use one Save button that appears or enables only when something changed, with the unsaved state visible (a save bar, a dirty marker) and a warning on navigating away.

## Why

Inferred from the references: Material and Apple define a switch as something that applies instantly, so a switch that waits for a Save button breaks the contract; Polaris's contextual save bar exists to make the explicit-save mode unmistakable.

## Examples

- Material 3 — switches take effect immediately and should not require a confirmation button — m3.material.io/components/switch/guidelines
- Polaris — contextual save bar shows when a form is dirty with Save and Discard — polaris.shopify.com/components/deprecated/contextual-save-bar

## Exceptions

A toggle whose effect is destructive or billable may open a confirmation before applying, which is still immediate mode.
