---
type: Decision
id: DDR-003
title: Rules in English, evidence quoted verbatim in its original language
date: 2026-09-02
decision_status: accepted
context_source: Planning conversation 2026-09-02; Fabio chose 'English, pt-BR quotes kept'
  over pt-BR throughout or bilingual rules.
---
## Decision

Decision rules, pattern descriptions, and compiled skills are written in English. Evidence lines quote Fabio's directives exactly as typed, in Portuguese or English, typos included. pt-BR nouns that appear in evidence get a row in glossary.md.

## Why

Fabio gives the strongest directions in pt-BR ('F e E definitivamente não') and the routine ones in English. The rule needs to be portable across models and teammates; the quote needs to stay recognisable as Fabio's own words so a reviewer can check the generalisation against its source. Normalising the quote would destroy the evidence; writing the rule in pt-BR would halve its reach.

## Alternatives rejected

Bilingual rules — doubles maintenance for one reader. pt-BR throughout — matches the strongest directives but not the tooling, the models, or the other harvest sources, which are English.

## Consequences

The transcript miner must be typo-tolerant. The glossary grows with every harvest; 60+ rows after the first pass.
