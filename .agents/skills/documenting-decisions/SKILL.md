---
name: documenting-decisions
description: Write plan:decision entries in PodOS plans — what the text of a decision states (first sentence = the choice, no mechanics, no narration, no WIP state), who it is attributed to (human vs LLM authorship, incl. delegated/autonomous work), and how to split entries mixing the human's choice with LLM-authored detail. Use when creating a plan:decision entry, or when reviewing, rewriting, or attributing existing ones. Not for ADRs (see the adr skill).
---

# Documenting decisions

Rules for `plan:decision` entries in PodOS plans. Where decisions live and how
they reach the pod is the podos-plans skill's job; this skill is about the
text of a decision. Apply it when creating a decision entry and when reviewing
or rewriting existing ones.

## The decision is the first sentence

- One decision per entry; the first sentence states the choice itself,
  normatively — a reader skimming one line can state what was decided.
- Do not prefix the text with "Decision:" — the `plan:decision` property
  already names the entry as a decision.

## What stays out

- Implementation mechanics and environment facts go to `plan:scope` /
  `plan:note` — not even as a trailing clause of the decision.
- Rationale earns its place only when it changes what the choice means: a
  constraint that forces the option, a trade-off the reader must weigh.
- No process narration ("Angelo confirmed", "stopped the trial-and-error
  here") — who contributed what lives in `prov:wasAttributedTo`, not in the
  text.
- No work-in-progress state ("not yet green", "written but not merged") —
  status lives in the task status and `plan:verification`. When the state
  resolves, rewrite the entry instead of appending a correction.

## Splitting mixed entries

When an entry would mix the human's choice with LLM-authored mechanics or
rationale, split it: the choice in a human-attributed `plan:decision`, the
mechanics and rationale in a separate LLM-attributed `plan:scope` or
`plan:note` entry (full attribution rules in the podos-plans skill).

## Attribution

Attribution is decided entry by entry with one question: did a human state
this (verbatim quote, explicit choice, confirmation)? Their WebID if yes; the
LLM's agent if no.

**Delegation shifts attribution to the LLM.** When the human hands a task over
to run autonomously ("plan this yourself", "do it without asking"), text extrusions from LLM are attributed to the LLM agent.
