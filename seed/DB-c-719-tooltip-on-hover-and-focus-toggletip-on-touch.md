---
id: DB-c-719
title: A tooltip opens on hover and focus, and its content is tap-reachable on touch
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: tooltips
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/tooltip-guidelines/ — Nielsen Norman Group (Tooltip Guidelines)"
  - "reference:https://inclusive-components.design/tooltips-toggletips/ — Inclusive Components, Heydon Pickering (Tooltips and Toggletips)"
  - "reference:https://carbondesignsystem.com/components/toggletip/usage/ — IBM Carbon Design System (Toggletip usage)"
  - "reference:https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ — W3C WAI (ARIA Authoring Practices, Tooltip pattern)"
last_seen: 2026-09-03
---
## Rule

Hover and focus are the same trigger: tabbing to the element shows the tooltip, and its text is associated with the element for screen readers.

Because touch has no hover, the same information is either always visible on small screens or exposed through a tap-to-open toggletip with an explicit icon. A hover-only tooltip is a bug.

## Why

Inferred from the references: NN/g lists keyboard and touch as the two audiences hover-only tooltips exclude; Inclusive Components and Carbon give the toggletip (tap to open, tap again or Escape to close) as the touch-safe counterpart.

## Examples

- Carbon — toggletip opens on click, is focusable, and is the recommended pattern where hover is unavailable — carbondesignsystem.com/components/toggletip/usage/

## Exceptions

None recorded.
