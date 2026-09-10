---
type: Task Ledger
title: Todos
---
## Todo

- [ ] TASK-001 First review pass of the 118 candidates in inbox/ using inbox/_REVIEW.md; promote, retire, or rescope each
  status: todo · opened: 2026-09-02
  genesis: plan 2026-09-02
- [ ] TASK-002 Settle the three contested values (own-product-c CTA hue, radius rules, dark-mode default) and merge the seven flagged overlaps
  status: todo · opened: 2026-09-02
  genesis: inbox/_REVIEW.md 2026-09-02
- [ ] TASK-003 Compile confirmed-only skills and run the six eval prompts with skills off and on; record correction counts in evals/results.md
  status: todo · opened: 2026-09-02
  genesis: plan 2026-09-02 step 4
- [ ] TASK-004 Run design-brain-check against one live page (a product site or the portfolio) and confirm no false positives on deliberate choices
  status: todo · opened: 2026-09-02
  genesis: plan 2026-09-02 step 4
- [ ] TASK-005 Install exports: write taste-profile.json into ~/.gstack/projects, append learnings.jsonl fragments, enable cross_project_learnings
  status: todo · opened: 2026-09-02
  genesis: plan 2026-09-02 (deferred after POC)
- [ ] TASK-006 Build the capture loop: a /db skill to file a candidate mid-session and an incremental harvest since last run
  status: todo · opened: 2026-09-02
  genesis: plan 2026-09-02 (deferred after POC)
- [ ] TASK-007 Skim inbox/_review-queue.md (89 uncited transcript turns) once, then delete it; improve the miner's dedupe so quotes match evidence
  status: todo · opened: 2026-09-02
  genesis: harvest 2026-09-02
- [ ] TASK-008 Add the transcript-less own products as taste sources when their design sessions exist
  status: todo · opened: 2026-09-02
  genesis: harvest 2026-09-02
- [ ] TASK-009 Compiler: render examples in a name-free structured form (values or use-case sentence) so concreteness returns to the skill without project names
  status: todo · opened: 2026-09-03
  genesis: DDR-005 2026-09-03
- [ ] TASK-010 Multi-project root mode: design-brain init <root> discovers projects, asks scope per project, writes sources.yaml; one-off mode for a single project
  status: todo · opened: 2026-09-03
  genesis: brief 'Where it is going' 2026-09-03
- [ ] TASK-011 Verdict and harvest log: append every candidate creation, verdict, and compile to a JSONL with timestamp and evidence ids; surface it in the review app
  status: todo · opened: 2026-09-03
  genesis: brief 'Where it is going' 2026-09-03
- [ ] TASK-012 Organise the compiled skill by use case and common component in addition to dimension (answer QUESTION-007 first)
  status: todo · opened: 2026-09-03
  genesis: brief 'Where it is going' 2026-09-03
- [ ] TASK-013 Generalise scope for other users: personal = the running designer; universal = shareable base; client stays private
  status: todo · opened: 2026-09-03
  genesis: brief 'Where it is going' 2026-09-03
- [ ] TASK-014 Package for other designers: CLI or plugin, install docs, first-run flow from folder to review queue to compiled skills
  status: todo · opened: 2026-09-03
  genesis: brief 'Where it is going' 2026-09-03
- [ ] TASK-015 Seed the queue with published heuristics (kind: heuristic, DB-c-600…) and known biases to avoid (kind: bias, DB-c-650…), each with a reference: source; Fabio decides in the review app
  status: todo · opened: 2026-09-03
  genesis: Fabio 2026-09-03
- [ ] TASK-016 Review app: notes textarea on each card, saved into the file as '## Review notes' with the verdict or on its own (done 2026-09-03); next: an 'apply review notes' pass that rewrites rule text from the notes
  status: todo · opened: 2026-09-03
  genesis: Fabio 2026-09-03
- [ ] TASK-017 Seed component practices (kind: practice, DB-c-700…) for notifications, profile, settings, tooltips, search, tables, sorting, filtering, highlight cards, progressive disclosure, modals, drawers, details page
  status: todo · opened: 2026-09-03
  genesis: Fabio 2026-09-03
- [ ] TASK-018 Split tool from brain: extract scripts/, templates/, review app, compiler, extraction prompt and the tool's Forge record into a new public repo with clean history; brain path becomes configurable
  status: todo · opened: 2026-09-03
  genesis: DDR-007 2026-09-03
- [ ] TASK-019 Move Fabio's brain (inbox, decisions, patterns, inventory, exports, sources.yaml, glossary, evals) into a private repo the tool points at; keep the current repo private until then
  status: todo · opened: 2026-09-03
  genesis: DDR-007 2026-09-03
- [ ] TASK-020 Seed pack: the reference candidates (heuristic, bias, practice) become the starter set of a new brain; design-brain init <dir> creates a brain from them
  status: todo · opened: 2026-09-03
  genesis: DDR-007 2026-09-03
- [ ] TASK-021 Conflicts: resolution is one field per file, so a rule with several conflicts cannot say who wins per pair; move to a per-pair map (resolutions: {DB-012: ...}) and update the guard, compiler and drawer
  status: todo · opened: 2026-09-04
  genesis: conflict scan 2026-09-04
- [ ] TASK-023 harvest:ddrs recurrence: the same rule arriving from two ddr_dirs bumps occurrences instead of staging twice; an amended DDR is re-proposed; `reach: general` ranks first
  status: todo · opened: 2026-09-10
  genesis: DDR-014
  notes: **DDR-014 names both as follow-ups.** Recurrence is the signal that a per-project decision has become taste: match on normalised title or first sentence, append the second project's evidence line and slug to the existing queue entry or candidate. Re-proposal: a DDR whose number is below the high-water mark but whose file changed (an amendment) is staged again with a note. If Forge adopts a `reach` field on decisions, `general` entries go to the top of the queue.
- [ ] TASK-024 Per-scope exports: client:<slug> rules compile into that client's own record (design/design-system.md), never into the personal skills
  status: todo · opened: 2026-09-10
  genesis: ai-design proposal 2026-09-10 §5.3
  notes: **A16 has zero confirmed client rules because a client rule has nowhere to go.** The compiler already renders one scope structurally and name-free; a second target renders `client:<slug>` rules into that client's Forge record, where naming the client is fine because it is the client's repo. The leak guard on the personal skills is untouched. This is what OpenDesign's DESIGN.md would have been, done with what exists.
- [ ] TASK-025 Compile to every agent's native rules format — .cursor/rules, .github/copilot-instructions.md, AGENTS.md — with the same structural, name-free renderer
  status: todo · opened: 2026-09-10
  genesis: TASK-005
  notes: **Skills reach Claude Code and Codex; Cursor, Copilot and the rest read a different file.** One renderer, several output shapes, the same leak guard on each. Extends TASK-005's exports rather than replacing them.
- [ ] TASK-026 design-brain-check writes the Forge Check report shape (design/checks/<tag>/design-brain-check.md) so the taste pass lands in the record
  status: todo · opened: 2026-09-10
  genesis: ai-design proposal 2026-09-10 §3.1
  notes: **If Forge adopts a Check concept, the named-failure-pattern pass should produce it** rather than prose in a chat: checker, version, target route, findings with pattern id, evidence and fix. Runs locally, in the designer's own agent, because the brain is private; the report is project-specific and lives in that project's record, not in the brain.
- [ ] TASK-027 Publish the universal reference pack as a standalone checklist artifact a hosted gate can run with no personal or client content in it
  status: todo · opened: 2026-09-10
  genesis: TASK-020
  notes: **The 139 seeds are universal, sourced and project-agnostic — the Nielsen-style list a hosted heuristic pass needs, already written.** Render `scope: universal` confirmed rules and the reference candidates into one publishable checklist (JSON plus Markdown) a service can run without a brain. The personal and client scopes never enter it.
- [ ] TASK-028 Surface last_seen: on the card, and as a check warning after N months without new evidence — a decay signal, not a decay rule
  status: todo · opened: 2026-09-10
  genesis: QUESTION-006
  notes: **`last_seen` is written on every rule and read by nothing.** Show it on the card; let `check` warn when a confirmed rule has had no new evidence for N months (N configurable, default 12). The human decides whether a stale rule is retired or still true; nothing decays on its own.
- [ ] TASK-029 evals/results.md gains a model column so the same prompt set measures drift across model versions
  status: todo · opened: 2026-09-10
  genesis: TASK-003
  notes: **The eval method has no model axis, so a change in corrections cannot be told apart from a change in model.** One column; the runner stays a human in their own agent, the tool only ingests counts.
- [ ] TASK-030 Rewrite DDR-004 around the two-question test — does the why name this project → DDR; would it hold with a different client → DB; both → DDR now, DB when it recurs — and regenerate the CLAUDE snippet from it
  status: todo · opened: 2026-09-10
  genesis: ai-design proposal 2026-09-10 §3.2
  notes: **DDR-004 is still draft and the snippet routes by where you are (does this repo have a record) rather than by scope.** The two heuristics disagree exactly when a general choice is made in a repo with a record. Write the test into the DDR, accept it, and regenerate exports/CLAUDE-snippet.md from that wording.
- [ ] TASK-031 Convert inbox/_ddr-queue.md: fill dimension and stance for the design decisions, drop the tooling ones, add the keepers
  status: todo · opened: 2026-09-10
  genesis: DDR-014
  notes: **91 accepted decisions staged from forge and youtube-lms; most of the forge ones are about its own tooling.** Per the brain template rule 14: never fill the two fields by default value. Shorten the 22 flagged titles.

## Doing

## Done

- [x] TASK-022 harvest:ddrs — stage accepted decision records from projects with a ddr_dir as candidates missing dimension and stance; follow-ups: recurrence across projects, re-propose on amendment
  status: done · opened: 2026-09-09
  genesis: ai-design root audit 2026-09-09, Q1

## Deferred
