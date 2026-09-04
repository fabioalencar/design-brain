---
id: DB-c-728
title: "Search is keyboard-first: shortcut to focus, arrows, Enter and Escape to drive"
dimension: components
scope: universal
stance: always
status: candidate
source: practice
kind: practice
component: search
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ — W3C WAI (ARIA Authoring Practices, Combobox pattern)"
  - "reference:https://www.nngroup.com/articles/keyboard-accessibility/ — Nielsen Norman Group (Keyboard Accessibility)"
  - "reference:https://baymard.com/blog/autocomplete-design — Baymard Institute (Autocomplete Suggestions design patterns)"
last_seen: 2026-09-03
---
## Rule

A single documented shortcut ("/" or Cmd/Ctrl+K) focuses the search field from anywhere in the app.

With suggestions open, Up and Down move the highlight, Enter runs the highlighted or typed query, Escape closes suggestions and a second Escape clears the field.

The field is the search combobox pattern, so screen readers announce suggestion count and selection.

## Why

Inferred from the references:

- the ARIA combobox pattern defines the arrow/Enter/Escape contract
- NN/g's keyboard guidance requires that every pointer path has a keyboard equivalent
- Baymard lists keyboard navigation of suggestions as a baseline pattern

## Examples

- ARIA APG — combobox with listbox popup: Down opens and moves, Enter accepts, Escape closes — w3.org/WAI/ARIA/apg/patterns/combobox/

## Exceptions

None recorded.
