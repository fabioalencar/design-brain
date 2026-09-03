---
id: DB-c-722
title: "Every icon-only button has a tooltip that names the action, and that name is also its accessible label"
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: tooltips
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/tooltip-guidelines/ — Nielsen Norman Group (Tooltip Guidelines)"
  - "reference:https://carbondesignsystem.com/components/tooltip/usage/ — IBM Carbon Design System (Tooltip usage, icon buttons)"
  - "reference:https://atlassian.design/components/tooltip/usage — Atlassian Design System (Tooltip usage)"
last_seen: 2026-09-03
---
## Rule

An icon button without a visible label always carries a tooltip with a verb phrase ("Archive", "Copy link") and the same string as its accessible name. The tooltip text is the label, not a description, and it matches the wording used for that action elsewhere in the product.

## Why

Inferred from the references: NN/g names icon labels as the one case where tooltips are close to required; Carbon's icon-button guidance makes the tooltip mandatory and ties it to the aria-label so sighted and screen-reader users hear the same word.

## Examples

- Carbon — icon-only buttons must have a tooltip; the tooltip text doubles as the accessible name — carbondesignsystem.com/components/tooltip/usage/

## Exceptions

None recorded.

See also: DB-008
