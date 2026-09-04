---
id: DB-c-757
title: The common case is shown first; advanced options sit behind a named action
dimension: layout
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: progressive-disclosure
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/progressive-disclosure/ — Nielsen Norman Group (Progressive Disclosure)"
  - "reference:https://ui-patterns.com/patterns/ProgressiveDisclosure — ui-patterns.com (Progressive Disclosure pattern)"
  - "reference:https://design-system.service.gov.uk/components/details/ — GOV.UK Design System (Details component)"
last_seen: 2026-09-03
---
## Rule

A screen opens with the controls most people need most of the time.

The rest is reachable through one visible control labelled with its contents ("Show delivery options", "Advanced: retries and timeouts"), not a bare "More" or "Advanced".

The split is decided by observed frequency of use, and there are at most two levels of disclosure.

## Why

Inferred from the references: NN/g defines progressive disclosure as deferring rarely used features to a secondary screen to reduce error and learning cost, and stresses that the primary set must be right; GOV.UK's details component requires the summary text to describe what will be revealed.

## Examples

- GOV.UK — details component: the summary line tells people what is hidden before they open it — design-system.service.gov.uk/components/details/

## Exceptions

None recorded.

See also: DB-c-532
