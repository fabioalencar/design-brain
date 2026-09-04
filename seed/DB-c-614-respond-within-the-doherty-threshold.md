---
id: DB-c-614
title: "Respond within about 400 ms, or show progress so the wait feels attended"
dimension: components
scope: universal
stance: always
status: candidate
source: heuristic
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://lawsofux.com/doherty-threshold/ — Laws of UX, Doherty Threshold"
last_seen: 2026-09-03
---
## Rule

Interactions return a visible result within roughly 400 ms.

When the real work takes longer, the interface acknowledges immediately (optimistic update, skeleton, progress) so the user never faces a frozen screen.

## Why

Below this threshold the user stays in flow; above it attention drifts and the product feels broken.

## Examples

- Optimistic "liked" state applied on tap while the request completes.
- A skeleton layout for a list that loads in a second.

## Exceptions

A deliberate short delay can make a fast operation feel trustworthy (a security check that would otherwise seem to skip work).
