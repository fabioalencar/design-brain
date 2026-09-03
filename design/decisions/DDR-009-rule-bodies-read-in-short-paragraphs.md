---
type: Decision
id: DDR-009
title: Rule and Why sections read as short single-idea paragraphs; enumerations
  become lists
date: 2026-09-03
decision_status: accepted
context_source: 'Fabio, 2026-09-03, after the Medium typography pass: "maybe we need a rule to
  rewrite the card content to fit a good reading structure into paragraphs, like
  max of 5 rows". Measured: median Rule paragraph 6 rows, p90 10, max 29; 186 of
  299 files over the limit.'
---
## Decision

A Rule section opens with one sentence that states what to do or avoid, followed by at most two supporting paragraphs. Every paragraph in Rule and Why holds one idea and is at most about 300 characters, five rows at the review card's measure. Three or more enumerated cases become a list, not a sentence of semicolons. Why is one or two paragraphs, quote first when there is one. Detail that does not fit moves to Examples or Exceptions; nothing is deleted. The validator warns (not errors) on paragraphs over 300 characters and the review card shows a 'needs rewrite' chip.

## Why

Reading comfort on the card comes from structure as much as typography: a 29-row block is unreadable at any type size. The compiled skill takes the first paragraph of Rule, so the opening sentence is also what the agent reads. A warning rather than an error keeps harvesting unblocked; a new candidate lands and gets cleaned up in review.

## Alternatives rejected

Automatic reflow at sentence boundaries: yields five-row chunks that do not each hold one idea. A hard error: would block the 186 existing files and every future harvest until rewritten.

## Consequences

One rewrite pass over inbox and decisions (wording and structure only). Templates show the shape. The seed pack is refreshed from the rewritten reference candidates.
