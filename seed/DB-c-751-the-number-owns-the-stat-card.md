---
id: DB-c-751
title: "In a stat card the number is the largest element and the label sits below it in secondary type"
dimension: typography
scope: universal
stance: always
status: candidate
kind: practice
component: highlight-cards
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/dashboards-preattentive/ — Nielsen Norman Group (Dashboards: Making Charts and Graphs Easier to Understand)"
  - "reference:https://ui-patterns.com/patterns/dashboard — ui-patterns.com (Dashboard pattern)"
  - "reference:https://m3.material.io/components/cards/guidelines — Material Design 3 (Cards guidelines)"
last_seen: 2026-09-03
---
## Rule

A KPI or highlight card reads number first: the value in display size with tabular figures and tight leading, the metric name beneath it in a smaller muted style, and any delta or sparkline as the third element. The label never outweighs the number and the card carries no decorative icon larger than the type.

## Why

Inferred from the references: NN/g explains that size and position are pre-attentive, so the element meant to be read at a glance must be the biggest; the dashboard pattern describes the summary tile as one value plus context.

## Examples

- NN/g — use size, colour and position deliberately so the important value is seen before it is read — nngroup.com/articles/dashboards-preattentive/

## Exceptions

None recorded.

See also: DB-c-301
