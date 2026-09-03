---
id: DB-c-619
title: "Accept lenient input, emit strict output"
dimension: components
scope: universal
stance: always
status: candidate
kind: heuristic
confidence: 6
occurrences: [reference]
evidence:
  - "reference:https://lawsofux.com/postels-law/ — Laws of UX, Postel's Law"
last_seen: 2026-09-03
---
## Rule

Forms and parsers tolerate the variety of ways people actually type (spaces, dashes, case, pasted formatting) and normalise it, while what the product stores and displays is canonical and consistent.

## Why

Users should not be blamed for formatting; the machine is better at normalising than the person is at guessing the expected format.

## Examples

- A phone field that accepts "+55 (11) 9 8765-4321" and stores E.164.
- An email field that trims whitespace and lower-cases the domain.

## Exceptions

Where ambiguity is real (day/month order), ask rather than guess.
