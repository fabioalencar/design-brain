---
type: Decision
id: DDR-005
title: Compiled skills and default rules are project-agnostic; provenance stays in
  the ledger
date: 2026-09-03
decision_status: accepted
context_source: 'Fabio, 2026-09-03, stating the product direction: "Skills and rules should be
  project agnostic and neve contain mentions to older projects, only agnostic
  decisions and best practivs".'
---
## Decision

The compiler renders rules as what to do, what to avoid, and which pattern is preferred for a use case or component. It never emits a project name, client name, repo path, transcript quote, or project-specific value into skills/ or the default-rules export. Evidence, occurrences, examples with values, and quotes remain in decisions/ and patterns/ as provenance, reachable by id. A skill line may carry a count (observed in N projects) but not the names.

## Why

The brain is meant to be run by other designers on their own folders and to be shared. A rule that says "like we did on forge" is useless to anyone else and leaks client work. Agnostic phrasing also forces the rule to be stated as a real rule rather than a memory of one instance.

## Alternatives rejected

Keep examples with project names in the skill for concreteness: concreteness can come from values and use cases ("a queue: the outstanding row keeps the plain surface") without naming where it was seen. Strip names with a regex at compile time: unreliable; the ledger fields must be structured so the compiler never reads names in the first place.

## Consequences

compile-skills.ts drops occurrence names and the Seen: example excerpt from skill lines (done 2026-09-03). Examples need a structured, name-free form (a `values` list or a use-case sentence) before they can return to the skill; until then only the rule, stance, and count are rendered. The DB-c-### id stays in the skill so a reader can open the ledger for provenance.
