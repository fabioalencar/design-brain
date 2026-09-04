---
id: DB-c-608
title: "Error messages say what happened, why, and how to fix it, in plain language"
dimension: copy
scope: universal
stance: always
status: candidate
source: heuristic
kind: heuristic
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/ten-usability-heuristics/ — Nielsen Norman Group (Jakob Nielsen, 10 Usability Heuristics)"
last_seen: 2026-09-03
---
## Rule

An error names the problem in the user's words, states the cause when known, and proposes the next step.

No codes alone, no blame, no vague "something went wrong". The message appears where the problem is.

## Why

An error is a moment of confusion; a message that gives the fix turns it into a one-step recovery instead of a dead end.

## Examples

- "That email is already registered. Sign in instead, or reset your password."
- "Upload failed: the file is 12 MB, the limit is 10 MB. Compress it and try again."

## Exceptions

Security-sensitive cases (login) may deliberately withhold which field was wrong.
