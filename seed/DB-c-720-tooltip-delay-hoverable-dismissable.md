---
id: DB-c-720
title: "A tooltip opens after a short delay, stays open while the pointer moves into it, and closes on Escape or on leaving"
dimension: motion
scope: universal
stance: always
status: candidate
kind: practice
component: tooltips
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html — W3C WAI (WCAG 2.1 Understanding SC 1.4.13 Content on Hover or Focus)"
  - "reference:https://m3.material.io/components/tooltips/guidelines — Material Design 3 (Tooltips guidelines)"
  - "reference:https://atlassian.design/components/tooltip/usage — Atlassian Design System (Tooltip usage)"
last_seen: 2026-09-03
---
## Rule

Open after a short pause (a few hundred milliseconds) so passing the pointer across a toolbar does not flash tooltips; once one is open, moving to an adjacent trigger opens the next without the delay. The tooltip is dismissable with Escape without moving focus, remains visible while the pointer is over the tooltip itself, and does not close on its own before the person has read it. It never covers the element it describes.

## Why

Inferred from the references: WCAG 1.4.13 requires hover-triggered content to be dismissable, hoverable and persistent; Material and Atlassian specify the entry delay and the no-delay handoff between neighbouring triggers.

## Examples

- WCAG — dismissable, hoverable, persistent are the three tests for content on hover or focus — w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html

## Exceptions

None recorded.
