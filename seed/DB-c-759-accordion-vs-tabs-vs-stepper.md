---
id: DB-c-759
title: "Accordion for long independent sections read one at a time, tabs for parallel views of one object, stepper only for an ordered sequence"
dimension: components
scope: universal
stance: context
status: candidate
kind: practice
component: progressive-disclosure
confidence: 7
occurrences: [reference]
evidence:
  - "reference:https://www.nngroup.com/articles/accordions-complex-content/ — Nielsen Norman Group (Accordions on Desktop: When and How to Use)"
  - "reference:https://www.nngroup.com/articles/tabs-used-right/ — Nielsen Norman Group (Tabs, Used Right)"
  - "reference:https://www.nngroup.com/articles/wizards/ — Nielsen Norman Group (Wizards: Definition and Design Recommendations)"
  - "reference:https://design-system.service.gov.uk/components/tabs/ — GOV.UK Design System (Tabs component)"
last_seen: 2026-09-03
---
## Rule

Choose by how the content is read. Accordion: several sections a person may want to scan by heading and open selectively, where seeing two at once is useful. Tabs: alternative views of the same thing, short labels, no need to compare across tabs, no more than about seven. Stepper or wizard: steps that must happen in order and rarely. Never tabs for content people need side by side, and never an accordion for a short page that fits without it.

## Why

Inferred from the references: NN/g's separate articles set the conditions for each pattern (accordions for scannable long pages, tabs for parallel content with short labels, wizards for infrequent sequential tasks); GOV.UK adds that tabs should not be used when users need to compare content across sections.

## Examples

- GOV.UK — use tabs for related content people will not need to read together; otherwise show the content on the page — design-system.service.gov.uk/components/tabs/

## Exceptions

None recorded.
