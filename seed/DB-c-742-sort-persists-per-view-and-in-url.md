---
id: DB-c-742
title: "Sort state persists with the view, restores on return, and is encoded in the URL so a sorted view can be shared"
dimension: process
scope: universal
stance: prefer
status: candidate
kind: practice
component: sorting
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://polaris.shopify.com/components/selection-and-input/index-filters — Shopify Polaris (Index filters, saved views and sort)"
  - "reference:https://www.nngroup.com/articles/url-as-ui/ — Nielsen Norman Group (URL as UI)"
  - "reference:https://www.nngroup.com/articles/user-control-and-freedom/ — Nielsen Norman Group (User Control and Freedom)"
last_seen: 2026-09-03
---
## Rule

Changing the sort updates a query parameter; navigating into a row and back, or reloading, restores the same order; saved views store their sort with their filters. Sort is remembered per view, not globally, because the useful order differs by page.

## Why

Inferred from the references: NN/g argues that state in the URL makes views bookmarkable and shareable; Polaris bundles sort with filters in saved views so a working set can be returned to. Confidence is moderate because the per-view persistence rule is a synthesis rather than a single published guideline.

## Examples

- Polaris — index filters combine search, filters and sort into a saveable, named view — polaris.shopify.com/components/selection-and-input/index-filters

## Exceptions

None recorded.
