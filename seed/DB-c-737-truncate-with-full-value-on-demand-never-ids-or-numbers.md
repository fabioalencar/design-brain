---
id: DB-c-737
title: Long cell text truncates with the full value on demand; IDs and numbers never do
dimension: copy
scope: universal
stance: always
status: candidate
kind: practice
component: data-tables
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/patterns/overflow-content/ — IBM Carbon Design System (Overflow content pattern)"
  - "reference:https://atlassian.design/components/tooltip/usage — Atlassian Design System (Tooltip usage, truncated text)"
  - "reference:https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html — W3C WAI (WCAG 2.1 Understanding SC 1.4.13 Content on Hover or Focus)"
last_seen: 2026-09-03
---
## Rule

Free-text columns (names, descriptions) may clamp to one line with an ellipsis, and the full text is available through a tooltip on hover and focus or a row expansion.

Columns whose value must be read exactly (IDs, amounts, dates, status) get enough width or wrap instead. Truncation from the middle is used only for paths and hashes where both ends matter.

## Why

Inferred from the references:

- Carbon's overflow content pattern defines truncation with a tooltip as the standard treatment and lists what must not be truncated
- Atlassian names truncated text as a valid tooltip use
- WCAG requires that the revealed content be reachable by keyboard

## Examples

- Carbon — truncate end, start, or middle depending on which part of the value carries meaning, with the full string in a tooltip — carbondesignsystem.com/patterns/overflow-content/

## Exceptions

None recorded.

See also: DB-c-208
