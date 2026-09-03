---
id: DB-c-000
title: Short rule as one sentence, max 80 characters, two lines on the card; detail goes in Rule
dimension: color        # typography|color|spacing|layout|motion|copy|components|process|anti-slop
scope: personal         # universal|personal|client:<slug>|project:<slug>
stance: prefer          # always|never|prefer|avoid|context
status: candidate       # candidate|confirmed|retired
kind: harvested         # harvested (default) | heuristic | bias | practice — the latter three need a reference: evidence line
# component: data-tables  # practice only — one of lib.ts COMPONENTS
confidence: 5           # 1-10
occurrences: [project-slug]
evidence:
  - "transcript:<project>:<YYYY-MM-DD> \"verbatim quote, original language\""
  - "ddr:~/Code/forge/design/decisions/DDR-###-slug.md"
  - "audit:<gstack-project>/<audit-dir>#FINDING-###"
  - "repo:~/Code/<project>/<file>"
  - "reference:<url> — <who published it>"   # for heuristics and biases
last_seen: 2026-01-01
---
## Rule

One paragraph. The reusable statement, no project-specific values.

## Why

In Fabio's words where a quote exists; otherwise the inferred reason, marked as inferred.

## Examples

Values seen per project. `project — value — source`.

## Exceptions

When this does not apply. Empty is fine.
