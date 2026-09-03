---
id: DB-c-764
title: Content the user references while working elsewhere is never placed in a modal
dimension: components
scope: universal
stance: never
status: candidate
kind: practice
component: modals
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/modal-nonmodal-dialog/ — Nielsen Norman Group (Modal and Nonmodal Dialogs: When (and When Not) to Use Them)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/modality — Apple Human Interface Guidelines (Modality)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/panels — Apple Human Interface Guidelines (Panels)"
last_seen: 2026-09-03
---
## Rule

Help text, a record's details, a preview, a comparison, a checklist or anything the person will look at while typing or clicking elsewhere goes in a non-modal surface: a side panel, a drawer, an inline section, a popover or a separate page. The test is whether they would want the thing open and the page still usable at the same time.

## Why

Inferred from the references: NN/g's non-modal dialog is defined for exactly this case (information kept available while the page stays interactive); Apple's panels and modality guidance separate blocking tasks from auxiliary content.

## Examples

- NN/g — nonmodal dialogs let people keep interacting with the page while the dialog is open; use them for reference and secondary tasks — nngroup.com/articles/modal-nonmodal-dialog/

## Exceptions

None recorded.
