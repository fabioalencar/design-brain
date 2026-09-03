---
id: DB-c-711
title: Profile privacy defaults to least exposure; sharing more is a per-field opt-in
dimension: process
scope: universal
stance: always
status: candidate
kind: practice
component: user-profile
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://developer.apple.com/design/human-interface-guidelines/privacy — Apple Human Interface Guidelines (Privacy)"
  - "reference:https://www.nngroup.com/articles/the-power-of-defaults/ — Nielsen Norman Group (The Power of Defaults)"
last_seen: 2026-09-03
---
## Rule

A new profile exposes only what the product needs to function (name, avatar, role).

Email, phone, location, activity and similar fields start hidden or limited, and each has its own visibility control.

Never bundle visibility into one master toggle that flips everything, and never widen a default retroactively without telling the person.

## Why

Inferred from the references: NN/g shows that most people never change defaults, so the default is the real policy; Apple's privacy guidance asks products to collect and expose the minimum and to request more only with context.

## Examples

- Apple — request access only when needed and explain why; give people control over sharing — developer.apple.com/design/human-interface-guidelines/privacy

## Exceptions

None recorded.
