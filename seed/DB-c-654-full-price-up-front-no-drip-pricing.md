---
id: DB-c-654
title: "Show the full price up front; no drip pricing or fees revealed at the last step"
dimension: components
scope: universal
stance: never
status: candidate
kind: bias
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.deceptive.design/types/hidden-costs — deceptive.design (Harry Brignull), Hidden costs"
last_seen: 2026-09-03
---
## Rule

The price shown on the first screen where a price appears is the price the user will pay, including mandatory fees and taxes, or is clearly marked as excluding a named, estimated amount. Nothing new is added on the payment screen.

## Why

Drip pricing anchors the user on a low number and relies on sunk effort to make them accept the real one at the end.

## Examples

- A booking list that shows the nightly total with service fee included.
- A cart that estimates shipping before checkout starts.

## Exceptions

Charges that depend on information not yet collected (destination-based tax) are shown as an estimate, not omitted.
