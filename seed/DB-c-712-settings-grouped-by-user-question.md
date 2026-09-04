---
id: DB-c-712
title: Settings are grouped by the user's question, not by the implementing module
dimension: layout
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: settings
occurrences: [reference]
evidence:
  - "reference:https://developer.apple.com/design/human-interface-guidelines/settings — Apple Human Interface Guidelines (Settings)"
  - "reference:https://polaris.shopify.com/patterns/app-settings-layout — Shopify Polaris (App settings layout pattern)"
  - "reference:https://www.nngroup.com/articles/recognition-and-recall/ — Nielsen Norman Group (Memory Recognition and Recall in User Interfaces)"
last_seen: 2026-09-03
---
## Rule

Group settings under headings a person would search for ("Notifications", "Who can see my work", "Billing") and order groups by how often they are touched.

A group never mirrors a backend service, a database table or a team boundary. Each group has a one-line description only when the heading alone is ambiguous.

## Why

Inferred from the references: Apple asks for settings organised by what people are trying to do and to keep rarely used ones out of the way; Polaris lays settings out in titled groups with descriptions on the left and controls on the right.

Recognition beats recall, so headings must match the user's vocabulary.

## Examples

- Polaris — settings page as a stack of cards, each with a heading and description column beside its controls — polaris.shopify.com/patterns/app-settings-layout

## Exceptions

None recorded.

See also: DB-c-465
