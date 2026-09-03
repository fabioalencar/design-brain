---
id: DB-c-718
title: "A tooltip carries supplementary information only, in one short plain-text sentence; anything needed to complete the task is in the page"
dimension: copy
scope: universal
stance: always
status: candidate
kind: practice
component: tooltips
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/tooltip-guidelines/ — Nielsen Norman Group (Tooltip Guidelines)"
  - "reference:https://carbondesignsystem.com/components/tooltip/usage/ — IBM Carbon Design System (Tooltip usage)"
  - "reference:https://m3.material.io/components/tooltips/guidelines — Material Design 3 (Tooltips guidelines)"
last_seen: 2026-09-03
---
## Rule

Tooltip text is a clarification a person can live without: a definition, a keyboard shortcut, the full text of a truncated label. It is one sentence, roughly under 150 characters, plain text with no headings, lists or images. Required instructions, validation rules, prices, deadlines and errors go in visible page copy or helper text, never in a tooltip.

## Why

Inferred from the references: NN/g and Carbon both restrict tooltips to non-essential, brief content because they are hidden by default and unavailable to many touch and keyboard users; Material caps plain tooltips at a short phrase and moves anything longer to a rich tooltip or other surface.

## Examples

- Carbon — tooltip for brief definitions; anything requiring interaction or longer content moves to a toggletip or popover — carbondesignsystem.com/components/tooltip/usage/
- Material 3 — plain tooltip is a single short label; rich tooltip has a title and body but still no critical content — m3.material.io/components/tooltips/guidelines

## Exceptions

None recorded.

See also: DB-c-465
