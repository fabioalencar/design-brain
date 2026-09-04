---
id: DB-c-713
title: Settings that span more than two screens get a search field that finds by label
dimension: components
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: settings
occurrences: [reference]
evidence:
  - "reference:https://developer.apple.com/design/human-interface-guidelines/settings — Apple Human Interface Guidelines (Settings)"
  - "reference:https://www.nngroup.com/articles/search-visible-and-simple/ — Nielsen Norman Group (Search: Visible and Simple)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/search-fields — Apple Human Interface Guidelines (Search fields)"
last_seen: 2026-09-03
---
## Rule

Once settings need more than two screens or more than roughly forty individual controls, add a search field at the top of the settings area.

The field matches on setting labels, group names and synonyms, and jumps to the control with it highlighted. It is always visible on the settings landing page, not hidden behind an icon.

## Why

Inferred from the references: the platform Settings app on iOS and macOS gained search precisely because hierarchy alone stops scaling; NN/g's search guidance asks for a visible field where people will otherwise hunt.

## Examples

- Apple — the Settings app exposes a search field at the top of the root screen and highlights the matched row — developer.apple.com/design/human-interface-guidelines/settings

## Exceptions

None recorded.
