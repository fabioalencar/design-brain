---
type: Decision
id: DDR-013
title: Sessions are attributed to projects by working directory; skills install for every agent present
date: 2026-09-06
decision_status: draft
context_source: 'Fabio, 2026-09-06, after asking whether the tool worked with Codex: "we need
  to allow the harvest agnostic from any ai model projects and make the skill installation
  easy and out of the box"'
---
## Decision

The transcript harvester no longer knows about one agent. Each coding agent gets an adapter that reads its session files into one shape, the human turns plus the working directory the session ran in, and every session is attributed to the project whose `path` in sources.yaml contains that directory. Claude Code and Codex ship as adapters. Any other tool is covered by a generic reader for a folder of exported chats (.jsonl, .json, .md, .txt) that a project points at with `transcripts:`.

`design-brain install` links the compiled skills, and the tool's hand-written ones, into every agent skills directory on the machine: `~/.claude/skills` and `~/.agents/skills` (the open Agent Skills location, which Codex reads) always, and Gemini, Copilot, Cursor and OpenCode when that agent's home directory exists.

## Why

The brief names "any agent (Claude Code, Codex)" as the audience, but both harvest and install were hard-wired to Claude paths. Working directory is the one fact every agent records about a session, so matching on it removes per-agent configuration entirely: a designer lists projects once and every agent's sessions fall into place. Detecting agents by their home directory means install is one command with no flags, and never creates directories for tools the designer does not run.

## Alternatives rejected

Per-agent fields in sources.yaml (`claude_dir`, `codex_dir`): more to configure, and wrong the moment a designer adds an agent. Installing only into `~/.claude/skills` with documentation for the rest: the point is out of the box. Installing into every known location unconditionally: scatters `.gemini/skills` and friends onto machines that never had those agents.

## Consequences

Adding an agent is one adapter (roots, extensions, parse) and one test fixture. The incremental high-water mark is now per project and agent, so a newly added agent gets a full first scan. `transcripts_dir` is no longer needed in sources.yaml; when present it is honoured as an extra Claude root. The review app's install button and the CLI report which agents received links, and a skill card shows a partial install rather than a false "linked".
