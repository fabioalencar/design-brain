---
id: DB-c-721
title: A tooltip never holds interactive content; links and buttons go in a popover
dimension: components
scope: universal
stance: never
status: candidate
kind: practice
component: tooltips
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/tooltip/usage/ — IBM Carbon Design System (Tooltip usage, tooltip vs popover)"
  - "reference:https://atlassian.design/components/tooltip/usage — Atlassian Design System (Tooltip usage)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/popovers — Apple Human Interface Guidelines (Popovers)"
  - "reference:https://www.nngroup.com/articles/tooltip-guidelines/ — Nielsen Norman Group (Tooltip Guidelines)"
last_seen: 2026-09-03
---
## Rule

A tooltip is transient and has no focus of its own, so it cannot contain anything a person needs to click, type into or select. When the content needs an action (a "Learn more" link, a confirm button, a form), use a popover or toggletip that opens on click, takes focus, and closes on Escape or an explicit close.

## Why

Inferred from the references: Carbon, Atlassian and NN/g all state that interactive content inside a hover tooltip is unreachable by keyboard and disappears as the pointer moves; Apple's popover is the surface designed to hold controls.

## Examples

- Carbon — tooltip: text only; popover: for interactive content and rich formatting — carbondesignsystem.com/components/tooltip/usage/

## Exceptions

None recorded.
