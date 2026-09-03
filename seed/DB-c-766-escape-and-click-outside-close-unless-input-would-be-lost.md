---
id: DB-c-766
title: Escape and click-outside close a modal unless closing would lose unsaved input
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
  - "reference:https://carbondesignsystem.com/components/modal/usage/ — IBM Carbon Design System (Modal usage, dismissing)"
  - "reference:https://atlassian.design/components/modal-dialog/usage — Atlassian Design System (Modal dialog usage)"
  - "reference:https://www.nngroup.com/articles/cancel-vs-close/ — Nielsen Norman Group (Cancel vs Close: Design to Distinguish the Difference)"
last_seen: 2026-09-03
---
## Rule

A confirmation or informational modal closes on Escape, on the close icon, on the backdrop, and on Cancel, all meaning the same thing: nothing happens. A modal holding a form the person has typed into does not close on the backdrop, and Escape or the close icon triggers a discard confirmation instead. A modal is never un-closable; a blocking error still offers a way out.

## Why

Inferred from the references: the ARIA dialog pattern makes Escape a required close; Carbon and Atlassian describe backdrop and Escape dismissal and the exception for unsaved changes; NN/g's cancel-versus-close piece is why the meaning of closing must be unambiguous.

## Examples

- Carbon — passive modals dismiss on Escape and backdrop click; transactional modals may require an explicit action — carbondesignsystem.com/components/modal/usage/

## Exceptions

None recorded.

See also: DB-c-540
