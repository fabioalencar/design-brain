---
id: DB-c-760
title: Disclosure state is visible and persists while the person stays on the page
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: progressive-disclosure
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ — W3C WAI (ARIA Authoring Practices, Disclosure pattern)"
  - "reference:https://design-system.service.gov.uk/components/accordion/ — GOV.UK Design System (Accordion component, remembering state)"
  - "reference:https://carbondesignsystem.com/components/accordion/usage/ — IBM Carbon Design System (Accordion usage)"
last_seen: 2026-09-03
---
## Rule

A disclosure trigger shows whether it is open with an icon that changes orientation and, where the text is a verb, a label that flips ("Show" / "Hide"); it carries aria-expanded.

Sections a person opened stay open through re-renders, validation and navigation within the same page, and an accordion that remembers its state across visits says so by behaving the same on return.

## Why

Inferred from the references:

- the ARIA disclosure pattern requires an expanded state exposed on the trigger
- GOV.UK's accordion stores open sections in session storage so returning users find them as left
- Carbon specifies the chevron rotation and open states

## Examples

- GOV.UK — accordion remembers which sections were open when the user returns to the page — design-system.service.gov.uk/components/accordion/

## Exceptions

None recorded.
