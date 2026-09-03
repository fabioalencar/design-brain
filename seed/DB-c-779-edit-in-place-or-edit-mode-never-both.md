---
id: DB-c-779
title: "A details page edits single fields in place or switches the whole record into an edit mode, never both on one page"
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: details-page
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://atlassian.design/components/inline-edit/usage — Atlassian Design System (Inline edit usage)"
  - "reference:https://design-system.service.gov.uk/patterns/check-answers/ — GOV.UK Design System (Check answers pattern)"
  - "reference:https://ui-patterns.com/patterns/InplaceEditor — ui-patterns.com (Inplace Editor pattern)"
last_seen: 2026-09-03
---
## Rule

Records with many independently changed fields (status, owner, due date) use inline editing per field with immediate save and a visible edit affordance. Records that are edited as a whole and validated together (an address, a contract) use one Edit action that opens a form (page or drawer) with Save and Cancel. Mixing the two on a page leaves the person unsure which fields changed and when they were saved.

## Why

Inferred from the references: Atlassian's inline edit defines the per-field model with confirm and cancel; GOV.UK's check-answers pattern defines the model where each change link opens the question page and returns; the in-place editor pattern records the trade-off between the two.

## Examples

- GOV.UK — check answers: each row has a change link that returns the user to this page after editing — design-system.service.gov.uk/patterns/check-answers/

## Exceptions

None recorded.

See also: DB-c-541
