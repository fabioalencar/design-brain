---
type: Decision
id: DDR-010
title: Conflicting rules are declared with conflicts_with and cannot compile without
  a resolution
date: 2026-09-04
decision_status: accepted
context_source: 'Fabio, 2026-09-04: "what happens when we have conflicting rules? do we have
  any treatment or callout?" There was none; three live cases were in the queue
  (system theme vs dark-first, four radius rules, sentence case vs
  no-lowercase).'
---
## Decision

A rule may carry `conflicts_with: [ids]` and a one-line `resolution:` stating which rule wins and when. The compiler renders the resolution as a precedence line beside both rules. Two confirmed rules that conflict with no resolution on either side stop the compile, the same way a project-name leak does. Candidates with an unresolved conflict compile in preview with an 'unresolved' marker and show a callout on the review card. A conflict scan proposes pairs into the ledger; the designer resolves them in the Rules tab.

## Why

If both sides of a contradiction compile, the agent picks one silently, which is the failure the brain exists to stop. Declaring the pair makes the disagreement visible; requiring a resolution turns it into precedence, which is what an agent can act on.

## Alternatives rejected

Automatic precedence by confidence or recency: hides a real judgement call behind a number. Refusing to promote the second rule: the designer often wants both, scoped differently; a resolution says so.

## Consequences

New frontmatter fields validated by check; a compile guard; a Rules tab with a Conflicts filter and a resolution editor; a scan pass over the existing ledger.
