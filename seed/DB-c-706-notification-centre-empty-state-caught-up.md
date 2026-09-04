---
id: DB-c-706
title: Notification centre empty state says the user is caught up, never a blank panel
dimension: copy
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: notifications
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/empty-state-interface-design/ — Nielsen Norman Group (Designing Empty States in Complex Applications)"
  - "reference:https://carbondesignsystem.com/patterns/empty-states-pattern/ — IBM Carbon Design System (Empty states pattern)"
  - "reference:https://atlassian.design/components/empty-state/usage — Atlassian Design System (Empty state usage)"
last_seen: 2026-09-03
---
## Rule

When there are no notifications, the panel shows one short line that says nothing needs attention (and, if filters are applied, that the filter is the reason) plus at most one action such as notification settings.

It keeps the panel's size so opening and closing does not jump. Never an empty white rectangle or a spinner that resolves to nothing.

## Why

Inferred from the references: NN/g and Carbon treat the empty state as a first-class state that explains why it is empty and what, if anything, to do; a blank panel reads as broken.

## Examples

- Carbon — "no notifications" empty state variant with illustration optional and one sentence — carbondesignsystem.com/patterns/empty-states-pattern/

## Exceptions

None recorded.

See also: DB-c-214
