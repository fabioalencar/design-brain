---
id: DB-c-774
title: A details page opens with the record's identifier, status and one primary action
dimension: layout
scope: universal
stance: always
status: candidate
kind: practice
component: details-page
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://polaris.shopify.com/patterns/resource-details — Shopify Polaris (Resource details layout pattern)"
  - "reference:https://atlassian.design/components/page-header/usage — Atlassian Design System (Page header usage)"
  - "reference:https://polaris.shopify.com/components/layout-and-structure/page — Shopify Polaris (Page component)"
last_seen: 2026-09-03
---
## Rule

The header shows the human identifier (name or number), a status badge, breadcrumb or back link, and a single primary action for the record's most common next step, with the rest in a secondary actions menu. Nothing else competes in the header. The identifier is the page title and the browser title.

## Why

Inferred from the references: Polaris's resource details layout and page component put title, status badge, primary action and secondary actions in the page header by design; Atlassian's page header defines the same slots (title, breadcrumbs, actions).

## Examples

- Polaris — resource details page: back link, title, status badge, primary action and action menu in the header — polaris.shopify.com/patterns/resource-details

## Exceptions

None recorded.

See also: DB-c-465
