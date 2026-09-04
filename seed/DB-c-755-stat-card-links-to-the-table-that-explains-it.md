---
id: DB-c-755
title: "A stat card is a link to the table or view that explains its number"
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
  - "reference:https://ui-patterns.com/patterns/dashboard — ui-patterns.com (Dashboard pattern)"
  - "reference:https://www.nngroup.com/articles/dashboards-preattentive/ — Nielsen Norman Group (Dashboards: Making Charts and Graphs Easier to Understand)"
  - "reference:https://m3.material.io/components/cards/guidelines — Material Design 3 (Cards guidelines, actionable cards)"
last_seen: 2026-09-03
---
## Rule

Clicking a highlight card opens the list, table or report whose rows sum to the number, with the same period and filters pre-applied.

The card shows a subtle affordance (hover state, chevron or "View") so the link is discoverable, and the whole card is the target. A number that cannot be drilled into is labelled as an estimate or rollup.

## Why

Inferred from the references:

- the dashboard pattern's tiles exist as entry points into detail
- NN/g notes that people ask "why" as soon as they see an unexpected value, and a dead-end tile leaves that unanswered
- Material defines the clickable card and its states

## Examples

- ui-patterns — Dashboard widgets summarise and link to the full view — ui-patterns.com/patterns/dashboard

## Exceptions

None recorded.
