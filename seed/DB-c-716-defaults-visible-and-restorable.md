---
id: DB-c-716
title: Every setting shows its default and offers a way to restore it
dimension: components
scope: universal
stance: prefer
status: candidate
kind: practice
component: settings
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/the-power-of-defaults/ — Nielsen Norman Group (The Power of Defaults)"
  - "reference:https://www.nngroup.com/articles/reset-and-cancel-buttons/ — Nielsen Norman Group (Reset and Cancel Buttons)"
  - "reference:https://ui-patterns.com/patterns/GoodDefaults — ui-patterns.com (Good Defaults pattern)"
last_seen: 2026-09-03
---
## Rule

A setting that has been changed from its default shows the default value in its description ("Default: 30 days") or marks the control as modified, and a "Restore default" affordance sits with it or at the group level. A global reset of all settings, if offered, lives in the danger zone and confirms.

## Why

Inferred from the references: NN/g warns against form-level Reset buttons because they wipe work, but a scoped restore is the safe version of the same need; visible defaults let people undo an experiment without remembering the prior value.

## Examples

- ui-patterns — Good Defaults: preselect the value most people want, and make it recoverable — ui-patterns.com/patterns/GoodDefaults

## Exceptions

None recorded.
