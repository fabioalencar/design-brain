---
id: DB-c-744
title: On desktop, filters are visible as a panel or bar, not behind one Filter button
dimension: layout
scope: universal
stance: prefer
status: candidate
kind: practice
component: filtering
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://carbondesignsystem.com/patterns/filtering/ — IBM Carbon Design System (Filtering pattern)"
  - "reference:https://baymard.com/blog/horizontal-filtering-sorting-design — Baymard Institute (Be Careful with Horizontal Filtering Toolbars)"
  - "reference:https://www.nngroup.com/articles/filters-vs-facets/ — Nielsen Norman Group (Filters vs. Facets)"
last_seen: 2026-09-03
---
## Rule

The filters that matter most are shown open, either in a left panel for catalog-like data or a toolbar row above a table for a handful of filters.

Extra, rarely used filters may sit behind a "More filters" control. A design where every filter is behind one button hides the fact that filtering exists.

## Why

Inferred from the references: Carbon's filtering pattern lays out panel and toolbar placements by filter count; Baymard finds horizontal toolbars are overlooked when filter values are hidden, while NN/g's comparison shows visible facets teach people what the data contains.

## Examples

- Carbon — filter panel for many filters, toolbar filters for a few, always visible above or beside the results — carbondesignsystem.com/patterns/filtering/

## Exceptions

On narrow mobile widths filters may collapse into a tray or sheet opened by a button that shows the applied count.
