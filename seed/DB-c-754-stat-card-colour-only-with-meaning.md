---
id: DB-c-754
title: Colour on a stat card only encodes meaning; decorative colour is dropped
dimension: color
scope: universal
stance: never
status: candidate
kind: practice
component: highlight-cards
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/dashboards-preattentive/ — Nielsen Norman Group (Dashboards: Making Charts and Graphs Easier to Understand)"
  - "reference:https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html — W3C WAI (WCAG 2.1 Understanding SC 1.4.1 Use of Color)"
  - "reference:https://m2.material.io/design/color/color-usage.html — Material Design 2 (Color usage)"
last_seen: 2026-09-03
---
## Rule

A card's background, border and icon stay neutral; rainbow card sets and per-card accent tints are not used.

Colour appears only on the trend, in one of three tones (better, worse, no change) decided by the metric's own direction (a rising cost is worse), and it is always paired with the sign and an arrow so the meaning survives without colour.

## Why

Inferred from the references:

- NN/g shows colour is pre-attentive and therefore should be spent only where it signals something
- WCAG requires a non-colour carrier
- Material's colour usage reserves colour for meaning and hierarchy rather than decoration

## Examples

- NN/g — use colour sparingly and consistently so that it draws attention only to what matters — nngroup.com/articles/dashboards-preattentive/

## Exceptions

None recorded.

See also: DB-c-560, DB-026, DB-c-200
