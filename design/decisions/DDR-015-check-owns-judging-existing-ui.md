---
type: Decision
id: DDR-015
title: The check skill owns judging existing UI; no trigger phrase in two skill
  descriptions
date: 2026-10-12
decision_status: draft
reach: project
context_source: "First eval run of a real brain, 2026-10-12 (brain: evals/runs/2026-10-12/).
  Prompt 5 (\"This section looks generic, make it better.\" plus a pasted hero)
  loaded design-brain and never design-brain-check. A routing probe on the old
  descriptions reproduced it 9 of 9. Fabio: \"fix the design-brain-check routing
  for 'looks generic'\"."
---
## Decision

The compiled skills split their triggers by what the user starts from. `design-brain` owns building or changing UI from a brief. `design-brain-check` owns judging UI that already exists: "looks generic", sloppy, 'AI', 'off', "polish this", "make it look better", plus review, critique and QA. Its description says to load it first, before design-brain, and its body says to load design-brain after the scan when the user also asked for a fix. The main skill's description names the check skill as the place to start for existing UI without repeating any of its trigger phrases, and its body carries the same hand-off as a fallback. A compile test fails if the main description contains any of the check skill's trigger phrases.

## Why

An agent picks a skill from the listing descriptions alone. The old main description claimed 'make it look better' and 'it looks generic' as its own triggers while the check description claimed the same phrases, and with two matches the agent took the broader skill every time: 9 of 9 probe sessions loaded design-brain first, and the check skill reached the session before work started in 1 of 9, second. The check skill is the one that names patterns with evidence, which is what a "looks generic" request needs before any fix. After the split, 9 of 9 probe sessions on three phrasings loaded check first and then design-brain, and the build prompts (a hero from a brief, an empty state, fonts and a palette) still routed to design-brain or design-brain-start, 6 of 6.

## Alternatives rejected

Leaving both descriptions overlapping and adding the hand-off only to the main skill's body: routing is decided before the body loads, so the check skill would still be skipped whenever the main one won. Merging check into the main skill: one skill would carry both the rules and the 70 patterns on every UI task, and the separate pass before declaring work done would lose its own trigger. Removing the existing-UI phrases from both descriptions: nothing would own the most common way a designer asks for help.

## Consequences

A "looks generic, make it better" request now loads both skills, about 120KB of context, and its full run cost rose from about 1.00 to 2.33 USD in the eval. That raises the stakes on compiled skill size, which is a separate decision. Any new trigger phrase has to be added to exactly one description; the compile test enforces it for the known phrases.
