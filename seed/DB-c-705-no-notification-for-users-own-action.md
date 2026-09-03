---
id: DB-c-705
title: The user is never notified of their own action; that result is inline feedback
dimension: components
scope: universal
stance: never
status: candidate
kind: practice
component: notifications
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/indicators-validations-notifications/ — Nielsen Norman Group (Indicators, Validations, and Notifications)"
  - "reference:https://m2.material.io/design/communication/confirmation-acknowledgement.html — Material Design 2 (Confirmation and acknowledgement)"
  - "reference:https://www.nngroup.com/articles/push-notification/ — Nielsen Norman Group (Five Mistakes in Designing Mobile Push Notifications)"
last_seen: 2026-09-03
---
## Rule

Feedback for something the user did (saved, sent, deleted) appears where they did it: an inline status, a brief toast, or the changed record itself.

It does not enter the notification centre, does not increment the badge, and is not pushed. Notifications are reserved for events caused by other people, the system, or time.

## Why

Inferred from the references: NN/g frames validations and acknowledgements as immediate, contextual feedback distinct from notifications; Material's acknowledgement pattern is a snackbar, not a persistent message. Self-notifications inflate the unread count with things the person already knows.

## Examples

- Material 2 — snackbar acknowledgement ("Message archived" with Undo) for the user's own action — m2.material.io/design/communication/confirmation-acknowledgement.html

## Exceptions

A long-running job the user started may notify on completion, because the result arrives later and elsewhere.
