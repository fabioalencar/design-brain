---
id: DB-c-768
title: Modal width comes from a fixed set; past a maximum height only the body scrolls
dimension: layout
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: modals
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/components/modal/usage/ — IBM Carbon Design System (Modal usage, sizes)"
  - "reference:https://atlassian.design/components/modal-dialog/usage — Atlassian Design System (Modal dialog usage, sizes)"
  - "reference:https://m3.material.io/components/dialogs/guidelines — Material Design 3 (Dialogs guidelines, layout)"
last_seen: 2026-09-03
---
## Rule

The design system defines a few modal widths (small for confirmations, medium for a short form, large for a picker) and a modal picks one; it does not set its own width.

Height is content-driven up to a viewport-relative maximum, after which only the body scrolls and the title and action buttons stay visible. A modal that needs to fill the screen is a page.

## Why

Inferred from the references: Carbon and Atlassian both define named modal sizes and a scrolling body with fixed header and footer so actions never scroll out of reach; Material limits dialog width and asks for content to be brief.

## Examples

- Atlassian — modal widths small, medium, large, x-large; body scrolls while header and footer stay — atlassian.design/components/modal-dialog/usage

## Exceptions

None recorded.
