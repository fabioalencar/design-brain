---
id: DB-c-746
title: The result count updates as filters change; a batched Apply shows its count
dimension: components
scope: universal
stance: prefer
status: candidate
kind: practice
component: filtering
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/applying-filters/ — Nielsen Norman Group (User Intent Affects Filter Design (batch vs. interactive))"
  - "reference:https://carbondesignsystem.com/patterns/filtering/ — IBM Carbon Design System (Filtering pattern)"
  - "reference:https://ui-patterns.com/patterns/LiveFilter — ui-patterns.com (Live Filter pattern)"
last_seen: 2026-09-03
---
## Rule

A visible "N results" sits at the top of the results and changes as each filter is toggled.

Where filtering is batched (mobile trays, expensive queries), the Apply button carries the projected count ("Show 42 results") so nobody applies a filter set that returns nothing.

The count and the chips are the two feedback channels; a filter that changes neither is broken.

## Why

Inferred from the references: NN/g compares interactive and batch filtering and recommends the count as feedback in both; the live filter pattern relies on instant result updates to make exploration safe.

## Examples

- NN/g — batch filters need a preview of the result count before applying; interactive filters update results immediately — nngroup.com/articles/applying-filters/

## Exceptions

None recorded.
