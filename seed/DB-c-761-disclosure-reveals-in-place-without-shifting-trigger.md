---
id: DB-c-761
title: Disclosure reveals content in place below its trigger without moving the trigger
dimension: motion
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: progressive-disclosure
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/progressive-disclosure/ — Nielsen Norman Group (Progressive Disclosure)"
  - "reference:https://design-system.service.gov.uk/components/details/ — GOV.UK Design System (Details component)"
  - "reference:https://www.nngroup.com/articles/animation-duration/ — Nielsen Norman Group (Executing UX Animations: Duration and Motion Characteristics)"
last_seen: 2026-09-03
---
## Rule

Opening a section pushes only the content beneath it; the trigger stays where the pointer or focus is, and nothing above it changes.

The expansion is a short eased height transition or instant, never a slide that scrolls the page. Disclosed content is not moved to a different region, a modal or a new page.

## Why

Inferred from the references:

- NN/g frames disclosure as staying in context so the person keeps their place
- GOV.UK's details reveals directly under the summary
- NN/g's motion guidance keeps state-change animation short so the layout settles before the person reads

## Examples

- GOV.UK — details expands the hidden text immediately below the summary link — design-system.service.gov.uk/components/details/

## Exceptions

None recorded.

See also: DB-c-143, DB-004
