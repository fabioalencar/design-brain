---
type: Decision
id: DDR-001
title: Scope separates Fabio's taste from client constraints
date: 2026-09-02
decision_status: accepted
context_source: Planning conversation 2026-09-02; Fabio answered the client-vs-personal
  question directly (client-g/client-g-site, client-d, client-e/client-e, client-f are client work).
---
## Decision

Every decision and pattern carries a scope: universal (craft that applies anywhere), personal (Fabio's taste, applied to own brands and unbranded work), client:<slug> (a client brand constraint), or project:<slug>. Client repos yield inventory and universal craft only; a client value can never be marked personal, and the validator rejects a personal-scope rule whose only occurrences are client projects.

## Why

The harvest mixes Fabio's own products with campaign microsites for client-a, client-b, client-c, a food brand, and client-e. Without a scope axis, client-a orange or client-e's density rules would compile into the defaults for Fabio's portfolio. Scope is the one field that makes cross-project aggregation safe.

## Alternatives rejected

A single personal/not-personal flag — loses the distinction between universal craft (usable on client work) and one-project quirks. Separate ledgers per client — duplicates the universal rules and hides recurrences.

## Consequences

sources.yaml is the registry of scope per project and must be kept current. The compiled design-brain skill renders universal and personal sections by default and client sections only when working on that client. design-brain-start asks the scope question first.
