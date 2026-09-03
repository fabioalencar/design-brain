---
id: DB-c-776
title: Details page sections are named by the question they answer, not the data model
dimension: copy
scope: universal
stance: prefer
status: candidate
kind: practice
component: details-page
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://polaris.shopify.com/patterns/resource-details — Shopify Polaris (Resource details layout pattern)"
  - "reference:https://www.nngroup.com/articles/recognition-and-recall/ — Nielsen Norman Group (Memory Recognition and Recall in User Interfaces)"
  - "reference:https://design-system.service.gov.uk/components/summary-list/ — GOV.UK Design System (Summary list)"
last_seen: 2026-09-03
---
## Rule

Headings read as the person's questions ("Where is it going", "Who is responsible", "What has changed") or plain nouns they use ("Shipping", "Owner", "History"), in the order those questions are asked. A heading never exposes a table name, an object type or an internal module. Fields are grouped under the question they serve even when they live in different tables.

## Why

Inferred from the references: Polaris organises the details page by task areas rather than by entity; NN/g's recognition principle means headings must match vocabulary the person already holds. Confidence is moderate because the naming rule is an extrapolation from those layouts.

## Examples

- Polaris — resource details cards grouped by what the merchant needs to know or do (customer, shipping, payment) — polaris.shopify.com/patterns/resource-details

## Exceptions

None recorded.

See also: DB-c-213
