---
id: DB-c-778
title: A details page carries an activity trail, newest first, with who, what and when
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: details-page
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://polaris.shopify.com/patterns/resource-details — Shopify Polaris (Resource details layout pattern, timeline)"
  - "reference:https://www.nngroup.com/articles/visibility-system-status/ — Nielsen Norman Group (Visibility of System Status)"
  - "reference:https://design-system.service.gov.uk/components/summary-list/ — GOV.UK Design System (Summary list)"
last_seen: 2026-09-03
---
## Rule

Every record that can change has a history section at the end of the page: a reverse-chronological list where each entry names the actor (person or system), the change (field, old value, new value, or the action taken) and the timestamp.

System events and comments share the trail in one order. The trail is read-only and never editable.

## Why

Inferred from the references: Polaris's resource details includes a timeline of events and comments as a standard region; NN/g's status heuristic extends to the past state of a record, since "what happened here" is the question a details page most often answers.

## Examples

- Polaris — timeline at the bottom of the details page listing events and comments with actor and time — polaris.shopify.com/patterns/resource-details

## Exceptions

None recorded.

See also: DB-c-507, DB-c-536
