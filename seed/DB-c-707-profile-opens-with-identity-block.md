---
id: DB-c-707
title: A profile page opens with one identity block; the avatar falls back to initials
dimension: layout
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: user-profile
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://atlassian.design/components/avatar/usage — Atlassian Design System (Avatar usage)"
  - "reference:https://atlassian.design/components/page-header/usage — Atlassian Design System (Page header usage)"
  - "reference:https://polaris.shopify.com/components/images-and-icons/avatar — Shopify Polaris (Avatar component)"
last_seen: 2026-09-03
---
## Rule

The top of a profile, in both self view and others' view, is one block: avatar, display name, the role or handle that disambiguates them, and at most one status (active, away, deactivated).

Everything else sits below in sections. An avatar without an image renders initials on a deterministic colour, never a broken image or a generic silhouette by default.

## Why

Inferred from the references: Atlassian's avatar guidance pairs the image with name and status and defines the initials fallback; page header guidance puts identity and status ahead of content so the reader confirms who before reading what.

## Examples

- Atlassian — avatar with presence indicator and status, initials fallback when no image — atlassian.design/components/avatar/usage

## Exceptions

None recorded.
