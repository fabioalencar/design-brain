---
id: DB-c-773
title: An entity drawer has a URL; opening that URL opens the list with the drawer open
dimension: process
scope: universal
stance: prefer
status: candidate
source: practice
kind: practice
component: drawers
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/url-as-ui/ — Nielsen Norman Group (URL as UI)"
  - "reference:https://www.nngroup.com/articles/user-control-and-freedom/ — Nielsen Norman Group (User Control and Freedom)"
last_seen: 2026-09-03
---
## Rule

When a drawer displays a record (an order, a person, a ticket), the address bar updates to that record's URL while the list stays underneath.

The browser back button closes the drawer, and pasting the URL elsewhere reproduces list plus drawer. Drawers for transient tasks (filters, a picker) do not get URLs.

## Why

Inferred from the references: NN/g treats the URL as part of the interface that must be shareable and bookmarkable; back-button behaviour that closes the drawer rather than leaving the page keeps control with the person. Confidence is moderate because no cited page addresses drawers specifically.

## Examples

- NN/g — every distinct view a person might want to return to or share should have its own URL — nngroup.com/articles/url-as-ui/

## Exceptions

None recorded.
