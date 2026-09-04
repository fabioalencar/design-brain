---
id: DB-c-709
title: The self view of a profile and the view others see are different views
dimension: layout
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: user-profile
occurrences: [reference]
evidence:
  - "reference:https://developer.apple.com/design/human-interface-guidelines/privacy — Apple Human Interface Guidelines (Privacy)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/managing-accounts — Apple Human Interface Guidelines (Managing accounts)"
  - "reference:https://www.nngroup.com/articles/visibility-system-status/ — Nielsen Norman Group (Visibility of System Status)"
last_seen: 2026-09-03
---
## Rule

The self view contains settings, private fields and edit controls; the view others get contains only what the person has chosen to expose.

When some fields are visible to others and some are not, the self view labels each field's visibility and offers a "view as others" preview rather than making the person guess.

## Why

Inferred from the references: Apple's privacy guidance asks products to make clear what is shared and with whom; NN/g's status heuristic asks the interface to show the current state, which for a profile means showing what is public.

Confidence is moderate because no cited page prescribes the preview mechanism itself.

## Examples

- Apple — be transparent about data use and give people control over what is shared — developer.apple.com/design/human-interface-guidelines/privacy

## Exceptions

Internal tools where every profile field is visible to every colleague can use one view.
