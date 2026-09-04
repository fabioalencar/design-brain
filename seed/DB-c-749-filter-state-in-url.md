---
id: DB-c-749
title: Filter state is encoded in the URL so a filtered view survives and can be shared
dimension: process
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: filtering
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/url-as-ui/ — Nielsen Norman Group (URL as UI)"
  - "reference:https://polaris.shopify.com/components/selection-and-input/index-filters — Shopify Polaris (Index filters)"
  - "reference:https://ui-patterns.com/patterns/TableFilter — ui-patterns.com (Table Filter pattern)"
last_seen: 2026-09-03
---
## Rule

Every applied filter, the search text, the sort and the page are query parameters.

- opening the link reproduces the view
- the browser back button undoes the last filter change
- a saved view is a named URL

Filters held only in component state are lost on refresh and cannot be handed to a colleague.

## Why

Inferred from the references: NN/g treats the URL as part of the interface that people bookmark and share; Polaris's index filters model saved views as persisted filter sets, which needs the state to be serialisable.

## Examples

- NN/g — a good URL is readable, hackable and reproduces the page state — nngroup.com/articles/url-as-ui/

## Exceptions

None recorded.
