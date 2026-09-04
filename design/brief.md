---
type: Brief
title: Brief
---
# Brief

What this project is, who it is for, and what it is deliberately not. This file
is the genesis: the requirements and definitions the work started from.

## What it is

design-brain is a cross-project memory of Fabio's design decisions, compiled into
Claude Code skills. It mines what Fabio already said and built (session transcripts,
Forge decision records, gstack design audits, the tokens and CSS of past repos) into
one ledger of candidate rules, lets Fabio confirm or retire each one, and renders the
confirmed set as three skills: `design-brain` (standing defaults), `design-brain-check`
(named failure patterns to detect), and `design-brain-start` (project kickoff).

It sits one level above Forge. Forge records decisions inside one project; design-brain
aggregates the ones that recur across projects and turns them into priors for the next
one. Confirmed decisions also export to gstack's taste-profile and learnings formats so
existing tooling honours them without a rewrite.

## The friction it removes

In Fabio's words, 2026-09-02: "Genesis of this is me working with AI and getting AI
slop. I dont want to keep fixing the same things, giving the same directions, or having
to restart a research without AI recalling directions from previous work."

The specific job is directing an AI agent through UI work on a new project. What is hard
today is that every project starts from zero: the same corrections (one accent hue,
squared CTAs on a squared brand, hero controls above the fold, no em dashes) are given
again, and research done on a previous project (font pairings, palettes, token
structure) is not recalled.

## Who it's for

Fabio, working alone or with an AI agent, on their own products (Forge among them) and
on studio work for others. Secondary: any agent (Claude Code, Codex) that reads the
compiled skills. Client brands are sources of inventory and universal craft only, never
of personal taste.

## The loop it drives

In Fabio's words: "put my design thinking and common directions on auto", so they can
"produce similar work or at least have a direction pre-defined based on previous
decisions".

The loop: start a design task → the skill applies the confirmed defaults and blocks the
known rejections → Fabio corrects only what is genuinely new → the correction is
harvested as a candidate → Fabio promotes it → the next project starts with one fewer
thing to say. It pays in corrections not given; the eval set in `evals/` counts them
before and after.

## Where it is going

In Fabio's words, 2026-09-03: "I'd like to launch it as a way for other designers run it
on top of their root folder with several projects to dive in or do a one-off to extract
design decisions, log everything and provide the interactive interface to filter what
makes to the design brain as skills to be reused or rules applied by default when
starting a new project. Skills and rules should be project agnostic and neve contain
mentions to older projects, only agnostic decisions and best practivs...what should be
done, what shoudl be avoide, which patterns are preferred based on use cases or common
components".

Read as requirements:

1. **Runs on a root folder**, not one repo: point it at `~/Code` (or any folder of
   projects) and it discovers projects, or run it once on a single project.
2. **Logs everything**: every harvest, every candidate, every verdict, with its evidence,
   so a designer can see why a rule exists and reverse it.
3. **The interactive queue is the product surface**: the review app is how a designer
   decides what enters their brain.
4. **Compiled output is project-agnostic**: skills and default rules never name a past
   project or client. They state what to do, what to avoid, and which pattern is
   preferred for a use case or a common component. Project names and values stay in
   the ledger as evidence; they do not travel into the skill.
5. **Two kinds of output**: skills to reuse, and rules applied by default when a new
   project starts.

## What it is not

- Not a design system. It records rules and their evidence; it does not ship components,
  tokens, or a UI kit. Inventory files are facts, not a source of truth for any project.
- Not a replacement for Forge or gstack. Per-project decisions stay in Forge DDRs;
  design-brain feeds gstack rather than competing with it.
- Not autonomous. No candidate is confirmed by an agent. Skills compile only from what
  Fabio promoted; the preview build exists to test the shape, not to be used daily.
- Not a client brand memory. Client constraints live scoped as `client:<slug>` and never
  become personal defaults.
- Not a scoring tool. `design-brain-check` names patterns and fixes; it does not grade.
