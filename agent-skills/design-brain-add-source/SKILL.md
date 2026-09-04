---
name: design-brain-add-source
description: Add a published design source (an article, a guideline page, a study) to the design-brain ledger as reviewable candidates. Use whenever the user shares a link or a passage and says to add it, save it, capture it, or "put this in the brain" — and whenever they read something and want its rules kept. Extracts only checkable rules, cites the source, and files them for review; it never promotes anything.
---

# design-brain-add-source

Turns something the user just read into candidates in their brain's `inbox/`, each with a
reference back to where it came from. The user reviews them later in the queue; nothing
here decides what they believe.

## When to use this

They paste a URL or a passage and want it kept: "add this", "save this to the brain",
"capture these guidelines". If they are describing a decision from their own work instead
of a published source, that is a different thing — a harvested rule, not a reference.

## Steps

0. **Check the reading list first.** If they say "process my reading list" or give no source
   at all, read `inbox/_reading-list.md` in their brain: links they saved from the review
   app. Work through them, and remove each line once its candidates are filed.

1. **Read the source.** Fetch the URL with whatever browsing tool this session has, or use
   the text they pasted. If you cannot reach it, say so and ask them to paste the passage
   rather than writing rules from the title alone.

2. **Find the brain.** Run `design-brain check` in their brain directory to confirm it is
   there. If they have not said which, ask, or use `$DESIGN_BRAIN`.

3. **Extract only checkable rules.** A rule earns a candidate when a reviewer could look at
   a screen and say whether it holds. Keep the source's substance, write it in your own
   words, and drop:
   - restatements of something the ledger already says (grep `inbox/` and `decisions/`
     for the idea first, and say which ones you skipped),
   - advice too vague to check ("be consistent", "know your users"),
   - anything specific to that author's product.

   Expect two to eight from a long article. Fewer, well-stated, beats many.

4. **Shape each one.**
   - `title`: one sentence naming the rule, **at most 80 characters**. It is the rule, not
     the article's headline and not the law's name.
   - `rule`: one sentence stating what to do or avoid, then at most two short paragraphs of
     one idea each, five rows maximum. Three or more cases become a list.
   - `why`: one or two short paragraphs. The mechanism, not a summary of the article.
   - `kind`: `heuristic` (a general usability rule), `bias` (something to avoid, whether a
     pattern that exploits users or one the designer falls into), or `practice` (good
     practice for a named component — then set `component`).
   - `stance`: `always`, `never`, `prefer`, `avoid` or `context`, honestly.
   - `confidence`: 8 or more only when the source states the rule outright; 6 when it
     supports the direction without saying it; note the doubt in `why`.
   - `scope`: `universal`. A published source is never the user's personal taste.
   - `evidence`: at least one `reference:<url> — Publisher, Title`. Cite the specific page,
     never a homepage. Add a second line for a study or spec the page rests on.

5. **Stage and write.** Put the objects in one JSON array in a scratch file, then:

   ```bash
   design-brain add /tmp/staged.json --brain <their brain>
   ```

   The ledger allocates the ids, writes the frontmatter and refuses anything malformed.
   Never write into `inbox/` by hand, and never set `status: confirmed`.

6. **Report.** List what you added with its id and title, name what you skipped as already
   covered, and tell them the queue is where they decide. Do not promote, retire, or
   compile.

## The shape `design-brain add` expects

```json
[
  {
    "title": "Put the primary action where the eye already is",
    "dimension": "layout",
    "stance": "prefer",
    "confidence": 7,
    "kind": "practice",
    "component": "modals",
    "rule": "One sentence, then at most two short paragraphs.",
    "why": "The mechanism, briefly.",
    "examples": "Optional, neutral, no project names.",
    "exceptions": "Optional.",
    "evidence": ["reference:https://example.com/article — Publisher, Title"]
  }
]
```

`dimension` is one of typography, color, spacing, layout, motion, copy, components,
process, anti-slop. `component` applies to a `practice` only.

## Rules this obeys

- **Candidates never self-accept.** Everything lands as `status: candidate`.
- **No client or project names** in a rule's text; a published source is universal.
- **Evidence is mandatory**: no reference, no candidate.
- **Titles are two lines**, bodies read in short paragraphs.
