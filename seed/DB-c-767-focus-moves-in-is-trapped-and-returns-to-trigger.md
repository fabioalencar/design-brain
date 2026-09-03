---
id: DB-c-767
title: Focus enters the modal and is trapped; on close it returns to the trigger
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: modals
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — W3C WAI (ARIA Authoring Practices, Modal Dialog pattern)"
  - "reference:https://carbondesignsystem.com/components/modal/usage/ — IBM Carbon Design System (Modal usage, accessibility)"
  - "reference:https://atlassian.design/components/modal-dialog/usage — Atlassian Design System (Modal dialog usage, accessibility)"
last_seen: 2026-09-03
---
## Rule

When a modal opens, focus lands on the first sensible element (the first field, or the least destructive button for confirmations) and Tab cycles only within the modal while the page behind is inert.

When it closes for any reason, focus returns to the trigger, and the trigger is still where it was. The modal has an accessible name from its title.

## Why

Inferred from the references: the ARIA modal dialog pattern specifies initial focus, the focus trap and focus return as requirements; Carbon and Atlassian implement and document the same behaviour.

## Examples

- ARIA APG — focus is placed inside the dialog on open, contained while open, and returned to the invoking element on close — w3.org/WAI/ARIA/apg/patterns/dialog-modal/

## Exceptions

None recorded.

See also: DB-c-420
