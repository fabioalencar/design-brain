---
id: DB-c-662
title: "Do not engineer endless sessions: infinite scroll and variable rewards get stopping cues"
dimension: components
scope: universal
stance: avoid
status: candidate
kind: bias
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://doi.org/10.1145/3544548.3580729 — Monge Roffarello, Lukoff, De Russis, Defining and Identifying Attention Capture Deceptive Designs, CHI 2023"
  - "reference:https://www.nngroup.com/articles/infinite-scrolling/ — Nielsen Norman Group, Infinite Scrolling"
last_seen: 2026-09-03
---
## Rule

Feeds have a visible end, pagination or a "you're caught up" marker; autoplay is off by default; notifications and pull-to-refresh do not deliver unpredictable rewards designed to keep people checking. Engagement is a by-product of value, not a target of the mechanics.

## Why

Removing natural stopping points and adding intermittent rewards exploits habit formation; the metric goes up while the user's stated goals go unmet.

## Examples

- A feed that paginates after a screenful with a "Load more" action.
- A "You've seen everything new" state at the end of the day's content.

## Exceptions

Content the user asked to consume continuously (a playlist, a long list they are searching) may load continuously, with the end still reachable.
