---
id: DB-c-630
title: "WCAG 2.2 AA is the floor for text contrast and pointer target size"
dimension: color
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://www.w3.org/TR/WCAG22/#contrast-minimum — W3C, WCAG 2.2 SC 1.4.3 Contrast (Minimum) and SC 2.5.8 Target Size (Minimum)"
last_seen: 2026-09-03
---
## Rule

Body text meets at least 4.5:1 against its background, large text and UI component boundaries at least 3:1, and every pointer target is at least 24 by 24 CSS pixels or has equivalent spacing. This is a floor for every palette, theme and component, not a target to aim at.

## Why

Below these ratios and sizes a measurable share of users cannot read or hit the interface; AA is the widely adopted legal and contractual baseline.

## Examples

- A muted caption colour checked against both light and dark surfaces before it enters the token set.
- Icon-only buttons padded so their hit area reaches the minimum even when the glyph is smaller.

## Exceptions

Logos, decorative text and disabled controls are exempt from the contrast rule; inline links in a sentence are exempt from the target rule.
