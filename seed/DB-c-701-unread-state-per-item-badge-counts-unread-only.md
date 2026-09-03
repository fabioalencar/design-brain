---
id: DB-c-701
title: Each notification shows its own read state; the badge counts only unread items
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: notifications
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://m3.material.io/components/badges/guidelines — Material Design 3 (Badges guidelines)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/notifications — Apple Human Interface Guidelines (Notifications, badging)"
  - "reference:https://www.nngroup.com/articles/visibility-system-status/ — Nielsen Norman Group (Visibility of System Status)"
last_seen: 2026-09-03
---
## Rule

Unread is a per-item state rendered on the item (weight, dot, or tinted row) and cleared when that item is opened or explicitly marked. The count badge on the entry point counts unread items only, disappears at zero, and never counts items the user has already seen.

## Why

Inferred from the references: Material and Apple describe a badge as a count of things that still need attention; a badge that never reaches zero stops meaning anything. NN/g's visibility heuristic asks the interface to show current state honestly, which a stale count violates.

## Examples

- Material 3 — small badge (dot) for presence, large badge for a count of unread; count is removed once the content is viewed — m3.material.io/components/badges/guidelines

## Exceptions

A digest or summary entry may report the count of items it wraps rather than its own read state.

See also: DB-c-514, DB-c-200
