# Contributing

Two kinds of contribution are welcome. The first needs no code.

## Add to the seed pack

`seed/` holds the reference candidates every new brain starts with: usability heuristics,
biases to avoid, and practices for common components. Each one is a Markdown file with a
frontmatter block and a short body, and each one cites a published source.

To add one:

1. Copy an existing file in `seed/`, for example `seed/DB-c-601-speak-the-users-language.md`.
2. Give it the next unused id in `seed/` and a slug that matches the title.
3. Fill the frontmatter. `kind` is `heuristic`, `bias` or `practice`. `scope` is
   `universal`. `status` stays `candidate`; the tool never ships anything pre-accepted.
4. Put the source in `evidence` as `reference:<url>` followed by the publisher, author
   and page title, the way the existing files do. A rule without a citation will be
   declined.
5. Write the body: `## Rule` states what to do or avoid in one sentence, then at most two
   short paragraphs. `## Why` explains it. `## Examples` is optional and welcome.
6. Check that a fresh brain still validates and compiles:

```bash
bun bin/design-brain.ts init /tmp/brain
bun scripts/check.ts --brain /tmp/brain
bun scripts/compile-skills.ts --brain /tmp/brain
```

Titles are at most 80 characters and name the rule, with every qualifier kept for the
body. `check` rejects longer titles and warns on long paragraphs.

What the seed pack is not for: anything from a specific project, product or client, and
anything that is a matter of taste rather than a checkable rule. Those belong in a brain,
which is private by design.

## Change the tool

```bash
bun install
bun test scripts/
```

Tests drive a real brain in a temporary directory, so a change to the ledger, the compiler
or the validator shows up there. Add a test for behaviour you add or change.

A few rules are enforced rather than suggested. Candidates never self-accept: no code
path sets `status: confirmed` except a verdict from the person running the tool.
Compiled output never names a project, a path or a quote; a guard re-reads every compile
for leaks. The review server listens on `127.0.0.1` only.

Decisions about the tool itself are recorded as DDRs in `design/decisions/`. If a change
rests on a choice that is not obvious from the code, add one.
