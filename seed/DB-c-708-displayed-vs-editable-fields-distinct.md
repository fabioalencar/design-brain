---
id: DB-c-708
title: Editable and displayed profile fields are distinct; one editing model per page
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: user-profile
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://atlassian.design/components/inline-edit/usage — Atlassian Design System (Inline edit usage)"
  - "reference:https://design-system.service.gov.uk/components/summary-list/ — GOV.UK Design System (Summary list, with actions)"
  - "reference:https://ui-patterns.com/patterns/InplaceEditor — ui-patterns.com (Inplace Editor pattern)"
last_seen: 2026-09-03
---
## Rule

A field the user can change shows an edit affordance at rest; a field they cannot change shows none and, when it matters, says who controls it ("managed by your organisation").

The affordance is a "Change" link, a pencil, or a hover-plus-focus field outline. Pick one editing model per page: inline per field with save/cancel on the field, or a single Edit that switches the whole page to a form.

## Why

Inferred from the references: GOV.UK's summary list attaches a visible "Change" action to each row; Atlassian's inline edit specifies the read view, hover state and confirm/cancel so a person knows before clicking whether a value is editable.

## Examples

- GOV.UK — summary list rows with a "Change" action link per editable row and no link for fixed rows — design-system.service.gov.uk/components/summary-list/
- Atlassian — inline edit with confirm and cancel buttons, keyboard Enter/Escape — atlassian.design/components/inline-edit/usage

## Exceptions

None recorded.

See also: DB-c-541
