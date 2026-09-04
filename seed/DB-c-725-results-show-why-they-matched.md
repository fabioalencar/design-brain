---
id: DB-c-725
title: "Each search result shows why it matched: highlighted terms and the matched field"
dimension: components
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: search
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/site-search-suggestions/ — Nielsen Norman Group (Site Search Suggestions)"
  - "reference:https://carbondesignsystem.com/patterns/search-pattern/ — IBM Carbon Design System (Search pattern)"
  - "reference:https://baymard.com/blog/ecommerce-search-query-types — Baymard Institute (Ecommerce Search UX Best Practices)"
last_seen: 2026-09-03
---
## Rule

A result row states the matched terms in context (a bold snippet) and, when the match was not in the title, names the field ("matched in notes").

When search spans entity types, results are grouped by type with counts. A result that gives no clue why it appeared is treated as a ranking bug.

## Why

Inferred from the references: NN/g's suggestion guidance and Carbon's search pattern both recommend highlighting the matched text so people can judge relevance without opening each hit; Baymard's query-type research shows matches on non-title fields are common and confusing when unexplained.

Confidence is moderate because none of the cited pages states the field-naming rule outright.

## Examples

- Carbon — bold the matching characters in results and suggestions — carbondesignsystem.com/patterns/search-pattern/

## Exceptions

None recorded.
