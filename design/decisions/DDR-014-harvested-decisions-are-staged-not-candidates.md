---
type: Decision
id: DDR-014
title: A harvested decision record is staged for the agent, never written as a
  candidate
date: 2026-09-09
decision_status: draft
context_source: 'ai-design root audit, 2026-09-09: sources.yaml declared ddr_dir for two
  projects and no script read it; DDR-004 names Forge DDRs as a source. Fabio:
  "ok, harvest:ddrs".'
---
## Decision

`harvest:ddrs` reads every project in sources.yaml that declares `ddr_dir`, keeps the decision records whose status is `accepted` and whose file the brain does not already cite as `ddr:` evidence, and stages them in two forms: a readable queue in `inbox/_ddr-queue.md` and the same items as candidate objects in `.cache/ddr-queue.json` with `dimension` and `stance` left empty. The agent supplies those two fields and runs `design-brain add`. The ledger refuses a candidate whose dimension or stance is not in the enum, so a half-filled queue cannot be added by accident. Both DDR formats are read (Forge v0.2 frontmatter and the older bullet form); a moved repository keeps its citations because dedupe is on the file name; the candidate inherits the project's scope; a title over 80 characters is flagged, not cut. The run is incremental on the highest DDR number per project, with `--all` to rescan; the queue holds every pending entry across runs and drops one only once the brain cites its file.

## Why

Dimension and stance are judgment, and the review app can edit stance but not dimension, so a guessed dimension would be stuck on the card. The same split already holds for transcripts: the script finds and dedupes, the agent classifies. Reading DDRs by script makes Forge's settled decisions a source without Forge knowing the brain exists, which keeps the public tool and the private ledger uncoupled (DDR-004). Dedupe on the file name rather than the path is what survived the move of every repo under ~/Code/ai-design.

## Alternatives rejected

Write candidates directly with `dimension: process` and `stance: always` as defaults: fast, but the wrong field lands on 100+ cards and cannot be swiped away. A design-vocabulary filter on DDR titles: only 13 of Forge's 115 titles pass it while cited decisions such as Forge's `DDR-111` (a feedback round has an end) would not, and the queue is a scratch file that costs nothing to skim. A Forge-side event or plugin: couples a public product to a personal tool.

## Consequences

Cross-project recurrence is not yet detected: the same rule text arriving from two ddr_dirs stages twice instead of bumping occurrences. An amended DDR is not re-proposed once its number is below the high-water mark. Both are follow-ups. sources.yaml gains a documented `ddr_dir`; the brain template's CLAUDE.md gains the conversion rule.
