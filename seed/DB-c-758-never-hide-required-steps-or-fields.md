---
id: DB-c-758
title: "Required fields and required steps are never hidden behind disclosure"
dimension: layout
scope: universal
stance: never
status: candidate
kind: practice
component: progressive-disclosure
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/progressive-disclosure/ — Nielsen Norman Group (Progressive Disclosure)"
  - "reference:https://design-system.service.gov.uk/components/details/ — GOV.UK Design System (Details component, when not to use)"
  - "reference:https://design-system.service.gov.uk/components/accordion/ — GOV.UK Design System (Accordion component)"
last_seen: 2026-09-03
---
## Rule

Anything the person must fill in or confirm to proceed is visible without opening anything.

Disclosure holds optional inputs, explanations and rarely changed settings. If validation fails inside a collapsed section, the section opens and the error is announced; a collapsed section with a required empty field is a design defect.

## Why

Inferred from the references: NN/g's principle is that the secondary layer holds what most people can skip; GOV.UK explicitly says not to use details or accordions for content people need to see, because many will not open them.

## Examples

- GOV.UK — do not use details to hide content most users need — design-system.service.gov.uk/components/details/

## Exceptions

None recorded.
