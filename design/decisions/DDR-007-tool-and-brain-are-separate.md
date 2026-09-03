---
type: Decision
id: DDR-007
title: The tool is public; each designer's brain is a private data directory; only
  reference seeds ship with the tool
date: 2026-09-03
decision_status: draft
context_source: "Fabio, 2026-09-03: \"do anyone else will be able to see my design brain when
  I share the repo to the public? I'd like to allow people to create their own
  design brains and maybe just the initial references (heuristics, biases...)
  could be on the initial scaffolding.\""
---
## Decision

design-brain splits into two things. The tool (scripts, templates, the review app, the compiler, the extraction prompt, the Forge record about the tool) is a public repository. A brain (sources.yaml, inbox/, decisions/, patterns/, inventory/, exports/, skills/, evals/, glossary.md) is a data directory the tool operates on, private by default and never inside the tool repository. The tool ships a seed pack of reference candidates (kind: heuristic, bias, practice) that a new brain starts with; harvested and personal material never ships. Fabio's own brain moves to a private repository the tool points at.

## Why

Today one repository holds both, and the brain is the sensitive half: verbatim transcript quotes, client names and palettes, local paths, raw client extractions. Publishing the repo as-is would publish all of it. Separating data from engine is also what lets another designer run the tool without inheriting Fabio's taste: they get the references and an empty inbox.

## Alternatives rejected

Publish the repo with a .gitignore over the sensitive folders: one mistake leaks everything, and the tool would still carry Fabio's confirmed decisions and patterns in git history. Scrub names from the brain and publish it: the brain is the designer's private record by definition; a scrubbed brain is neither useful to others nor safe.

## Consequences

A brain path setting (flag, env var, or a design-brain.json in the working directory) replaces the hard-coded root in scripts/lib.ts. `design-brain init <dir>` creates a brain from the seed pack. Fabio's current repository becomes the first brain; the tool is extracted from it into a fresh repository with clean history, so no harvested content is ever in the public history. A name scan of the reference candidates found only substring false positives, so the seed pack is clean as written.
