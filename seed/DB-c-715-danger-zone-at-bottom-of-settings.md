---
id: DB-c-715
title: Dangerous settings sit in a separated zone at the bottom, styled as destructive
dimension: layout
scope: universal
stance: always
status: candidate
kind: practice
component: settings
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/slips/ — Nielsen Norman Group (Preventing User Errors: Avoiding Unconscious Slips)"
  - "reference:https://www.nngroup.com/articles/confirmation-dialog/ — Nielsen Norman Group (Confirmation Dialogs Can Prevent User Errors, If Not Overused)"
  - "reference:https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-your-personal-account/deleting-your-personal-account — GitHub Docs (Deleting your personal account)"
last_seen: 2026-09-03
---
## Rule

Reset, delete, archive, transfer and disable-integration actions are collected in one labelled section at the end of the settings page, visually separated (border or background step) and using destructive button styling.

Each action names its consequence next to the button and confirms before running. Nothing destructive appears inline among ordinary controls.

## Why

Inferred from the references: NN/g's work on slips recommends spacing dangerous controls away from frequent ones and making them look different; confirmation is reserved for these rare actions so it stays meaningful.

## Examples

- GitHub — repository and account settings end with a "Danger Zone" section holding transfer, archive and delete — docs.github.com

## Exceptions

None recorded.

See also: DB-c-219
