---
id: DB-c-704
title: Notification severity is never carried by colour alone
dimension: color
scope: universal
stance: never
status: candidate
kind: practice
component: notifications
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html — W3C WAI (WCAG 2.1 Understanding SC 1.4.1 Use of Color)"
  - "reference:https://carbondesignsystem.com/components/notification/usage/ — IBM Carbon Design System (Notification usage, status and icons)"
  - "reference:https://design-system.service.gov.uk/components/notification-banner/ — GOV.UK Design System (Notification banner)"
last_seen: 2026-09-03
---
## Rule

Every notification variant pairs its colour with a status icon and a leading status word or title ("Error", "Success", "Important"). Someone who cannot see the colour must still know the severity from the shape and the text.

## Why

Inferred from the references: WCAG 1.4.1 forbids colour as the only carrier of information; Carbon and GOV.UK both ship each notification kind with an icon and a heading, not just a tint.

## Examples

- Carbon — error, warning, success and info notifications each carry a fixed icon and a bold title before the message — carbondesignsystem.com/components/notification/usage/
- GOV.UK — notification banner uses a text heading ("Important", "Success") ahead of the colour band — design-system.service.gov.uk/components/notification-banner/

## Exceptions

None recorded.

See also: DB-026, DB-c-502
