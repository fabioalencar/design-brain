---
id: DB-c-710
title: Destructive account actions sit apart from everyday settings and are confirmed
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: user-profile
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/confirmation-dialog/ — Nielsen Norman Group (Confirmation Dialogs Can Prevent User Errors, If Not Overused)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/managing-accounts — Apple Human Interface Guidelines (Managing accounts, account deletion)"
  - "reference:https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-your-personal-account/deleting-your-personal-account — GitHub Docs (Deleting your personal account)"
last_seen: 2026-09-03
---
## Rule

Delete account, transfer ownership, deactivate and similar actions sit in their own labelled section at the end of the profile or settings page, styled as destructive, never next to routine fields.

Triggering one opens a confirmation that states what will be lost and when, and for irreversible cases requires typing the account name or a word.

The action is available in the product, not only through support.

## Why

Inferred from the references:

- NN/g reserves confirmation dialogs for rare, consequential actions so they keep their force
- Apple requires in-app account deletion
- GitHub's account deletion flow is the widely copied example of a separated danger zone with typed confirmation

## Examples

- GitHub — "Delete account" in a separate Danger Zone, confirmation requires typing username and a phrase — docs.github.com

## Exceptions

None recorded.

See also: DB-c-219
