---
id: DB-c-723
title: "Search is one prominent, open field whose placeholder says what can be searched; on desktop it is never collapsed behind an icon"
dimension: components
scope: universal
stance: always
status: candidate
kind: practice
component: search
confidence: 8
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/search-visible-and-simple/ — Nielsen Norman Group (Search: Visible and Simple)"
  - "reference:https://carbondesignsystem.com/patterns/search-pattern/ — IBM Carbon Design System (Search pattern)"
  - "reference:https://developer.apple.com/design/human-interface-guidelines/search-fields — Apple Human Interface Guidelines (Search fields)"
last_seen: 2026-09-03
---
## Rule

A single text field with a search icon and enough width for a typical query sits in a consistent place (header or top of the list). Its placeholder names the searchable scope and fields ("Search orders by number, customer or SKU"), not the word "Search". Advanced syntax and extra options appear only after the field, never instead of it.

## Why

Inferred from the references: NN/g finds that a visible box outperforms a link or icon and that a wide box invites better queries; Apple asks placeholder text to hint at what the search covers; Carbon's pattern fixes placement and scope wording.

## Examples

- Apple — placeholder text in a search field describes the scope of what is searched — developer.apple.com/design/human-interface-guidelines/search-fields

## Exceptions

On narrow mobile headers the field may collapse to an icon that expands to a full-width field on tap.
