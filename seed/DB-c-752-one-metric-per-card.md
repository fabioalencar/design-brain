---
id: DB-c-752
title: "One metric per card; a card that needs two numbers is two cards or a table"
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: highlight-cards
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/dashboards-preattentive/ — Nielsen Norman Group (Dashboards: Making Charts and Graphs Easier to Understand)"
  - "reference:https://ui-patterns.com/patterns/dashboard — ui-patterns.com (Dashboard pattern)"
last_seen: 2026-09-03
---
## Rule

A highlight card answers one question with one value.

The comparison or trend attached to that value is context, not a second metric. When two values need to be read together (revenue and margin, opened and clicked) they become two adjacent cards or a compact table row where alignment does the comparing.

## Why

Inferred from the references: NN/g's dashboard guidance shows that each chart or tile should support one comparison, and that overloaded tiles are the ones people misread; the dashboard pattern describes tiles as single-purpose summaries.

## Examples

- ui-patterns — Dashboard: each widget shows a focused summary that links to detail — ui-patterns.com/patterns/dashboard

## Exceptions

None recorded.

See also: DB-c-301
