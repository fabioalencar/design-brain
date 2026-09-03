---
id: DB-c-762
title: A modal is only for a decision that must be made before the flow can continue
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: modals
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/modal-nonmodal-dialog/ — Nielsen Norman Group (Modal and Nonmodal Dialogs: When (and When Not) to Use Them)"
  - "reference:https://www.nngroup.com/articles/overuse-of-overlays/ — Nielsen Norman Group (Overuse of Overlays: How to Avoid Misusing Lightboxes)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/modality — Apple Human Interface Guidelines (Modality)"
  - "reference:https://carbondesignsystem.com/patterns/dialog-pattern/ — IBM Carbon Design System (Dialogs pattern)"
last_seen: 2026-09-03
---
## Rule

Everything that is not such a decision is inline, a drawer or a page. A modal interrupts, so it is reserved for confirming a destructive or irreversible action, capturing one piece of input the flow cannot proceed without, or reporting a blocking error. Viewing details, editing a record, onboarding tips, marketing and long forms do not qualify. If the person could reasonably want to do something else first, it is not a modal.

## Why

Inferred from the references: NN/g's definitions restrict modals to cases where the interruption is warranted and documents the cost of overlay overuse; Apple's modality guidance asks to minimise modality and use it only for focused, self-contained tasks; Carbon's dialog pattern lists the accepted purposes.

## Examples

- Apple — use modality only when it is critical to get attention, complete a task, or avoid confusion — developer.apple.com/design/human-interface-guidelines/modality

## Exceptions

None recorded.

See also: DB-c-218
