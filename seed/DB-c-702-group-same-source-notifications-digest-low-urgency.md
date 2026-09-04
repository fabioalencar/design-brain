---
id: DB-c-702
title: Same-source notifications are grouped; low-urgency ones roll into a digest
dimension: components
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: notifications
occurrences: [reference]
evidence:
  - "reference:https://developer.apple.com/design/human-interface-guidelines/notifications — Apple Human Interface Guidelines (Notifications, grouping and summaries)"
  - "reference:https://m2.material.io/design/platform-guidance/android-notifications.html — Material Design 2 (Android notifications, grouping)"
  - "reference:https://www.nngroup.com/articles/push-notification/ — Nielsen Norman Group (Five Mistakes in Designing Mobile Push Notifications)"
last_seen: 2026-09-03
---
## Rule

Group notifications by source and type into one expandable row that states the count ("3 comments on Invoice 204").

Anything below the needs-action tier is batched into a digest on a schedule the user can see and change, instead of arriving one by one.

## Why

Inferred from the references: Apple and Android both group by thread and offer scheduled summaries so the centre stays scannable; NN/g lists over-sending and sending each event separately as top push mistakes.

## Examples

- Apple — notification threads collapse per app and per thread; Scheduled Summary bundles non-urgent notifications at set times — developer.apple.com/design/human-interface-guidelines/notifications
- Android — group summary notification with child notifications under it — m2.material.io/design/platform-guidance/android-notifications.html

## Exceptions

Needs-action and blocking tiers are never digested.
