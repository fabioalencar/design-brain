---
id: DB-c-703
title: Dismissing a notification only hides it; resolving the item clears it
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: notifications
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/patterns/notification-pattern/ — IBM Carbon Design System (Notifications pattern, actionable notifications)"
  - "reference:https://atlassian.design/components/flag/usage — Atlassian Design System (Flag usage)"
  - "reference:https://www.nngroup.com/articles/user-control-and-freedom/ — Nielsen Norman Group (User Control and Freedom)"
last_seen: 2026-09-03
---
## Rule

A close control on a notification removes it from view and nothing else.

If the notification represents work (approve, review, fix), the action lives on the notification and completing it is what retires the notification everywhere, including the badge and the list.

Never let a close button silently mark something done, and never make the user finish the task to get rid of the message.

## Why

Inferred from the references: Carbon distinguishes non-actionable notifications (dismiss) from actionable ones (respond); Atlassian flags carry an action and a dismiss as distinct controls. Merging the two either loses work or traps people.

## Examples

- Atlassian — flag with primary action plus a dismiss icon; action-required flags are not auto-dismissed — atlassian.design/components/flag/usage

## Exceptions

Purely informational notifications have only dismiss.
