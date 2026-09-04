---
id: DB-c-700
title: Notifications are tiered by urgency and each tier gets one delivery channel
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: notifications
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/indicators-validations-notifications/ — Nielsen Norman Group (Indicators, Validations, and Notifications)"
  - "reference:https://carbondesignsystem.com/patterns/notification-pattern/ — IBM Carbon Design System (Notifications pattern)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/notifications — Apple Human Interface Guidelines (Notifications)"
last_seen: 2026-09-03
---
## Rule

Define a small set of urgency tiers (blocking, needs action, informational, passive) and map each tier to one channel.

- blocking goes to a modal or full-width banner
- needs-action goes to an inline or toast notification with an action
- informational goes to the notification centre
- passive goes to a badge or status indicator

A message never fires on two channels at once, and a tier never borrows a louder channel to get attention.

## Why

Inferred from the references: NN/g separates indicators, validations and notifications by how much they interrupt; Carbon's notification pattern assigns inline, toast, actionable and modal variants by severity and by whether the user must act.

One channel per tier keeps interruption proportional and stops the product from training people to ignore everything.

## Examples

- Carbon — inline notification for contextual status, toast for transient system events, actionable notification when a response is required, modal only for blocking errors — carbondesignsystem.com/patterns/notification-pattern/
- Apple — time-sensitive and passive interruption levels drive delivery, not the sender's preference — developer.apple.com/design/human-interface-guidelines/notifications

## Exceptions

A blocking security or data-loss event may pair a modal with a persistent banner after dismissal so the state is not lost.

See also: DB-c-218, DB-c-503
