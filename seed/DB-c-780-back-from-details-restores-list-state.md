---
id: DB-c-780
title: Back from a details page restores the list's scroll, sort, filters and selection
dimension: process
scope: universal
stance: always
status: candidate
kind: practice
component: details-page
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://design-system.service.gov.uk/components/back-link/ — GOV.UK Design System (Back link component)"
  - "reference:https://www.nngroup.com/articles/user-control-and-freedom/ — Nielsen Norman Group (User Control and Freedom)"
  - "reference:https://www.nngroup.com/articles/url-as-ui/ — Nielsen Norman Group (URL as UI)"
last_seen: 2026-09-03
---
## Rule

The back link in the header and the browser back button both return to the list exactly as it was left, which requires the list's state to be in the URL or restored from history.

The row that was opened stays visible and may be briefly highlighted. Losing the person's place after every detail view makes triage work impossible.

## Why

Inferred from the references: GOV.UK's back link takes the user to the previous page they were on, in the state they left it; NN/g's freedom heuristic and URL guidance together make the list state something the person owns, not something the page discards.

## Examples

- GOV.UK — back link: goes to the previous page; do not use it to reset or change what the user had done there — design-system.service.gov.uk/components/back-link/

## Exceptions

None recorded.
