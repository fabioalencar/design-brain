---
id: DB-c-753
title: A trend on a stat card names its comparison window and anchor
dimension: copy
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: highlight-cards
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/dashboards-preattentive/ — Nielsen Norman Group (Dashboards: Making Charts and Graphs Easier to Understand)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/charts — Apple Human Interface Guidelines (Charts)"
last_seen: 2026-09-03
---
## Rule

Every delta reads as "+12% vs previous 30 days" or "−3 vs target": the direction, the magnitude, and the thing it is compared to, in that order.

The window matches the card's own period. A number without an anchor (previous period, target, baseline) is not a KPI and is shown as a plain count without a trend.

## Why

Inferred from the references: NN/g's dashboard work shows comparisons are what make a number meaningful and that ambiguous baselines are a common source of misreading; Apple's chart guidance asks that every chart state what it compares and over what range.

## Examples

- Apple — describe the data, the timeframe and the comparison in text near the chart, not only visually — developer.apple.com/design/human-interface-guidelines/charts

## Exceptions

None recorded.

See also: DB-c-569, DB-c-560
