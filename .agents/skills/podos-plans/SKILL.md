---
name: podos-plans
description: Create, update, or query PodOS plans and tasks stored as RDF on the pod (dev-solid-server/data/dev/plans/**/plan.ttl). Use when planning or tracking work in PodOS — new plans, new tasks, status changes, or answering "what is planned / what's next / which tasks touch file X".
---

# PodOS plans as RDF

Plans live **on the pod**: `dev-solid-server/data/dev/plans/<plan-slug>/plan.ttl`,
one file per plan. The pod is the single location and source of truth.
The vocabulary is `<pod>/plans/plan-ontology.ttl` (prefix `plan:`), the
shapes are `<pod>/plans/plans.shacl.ttl`.

The currently worked-on plan is the **active plan**, tracked by a
`plan:active` pointer in `<pod>/plans/active.ttl`. The HTML viewer
(`http://localhost:3000/dev/plans/index.html` with the dev server running,
via `npm run dev:server`) renders the active plan as a board with full-screen
task detail; when starting or resuming work, check or set this pointer first.

## Reading plans

Query with `sparql_query_files` over the plan files (or all of them at once):

- Next work: all tasks with `plan:status plan:planned` whose dependencies
  (`plan:dependsOn`) are all `plan:done` — in that order across plans.
- Plan code impact: tasks where `plan:touchesFile` matches a path.
- Full context: for a single plan, query everything about it
  (`plan:context`, `plan:decision`, `plan:openQuestion`, `plan:option`,
  `plan:note` — each resolving to schema:Comment entries) — narrative detail
  lives in the graph.

For human browsing, open the HTML viewer — there are no markdown views.

IRIs: relative to each plan document — plan `<plan.ttl#plan>`, task
`<plan.ttl#task-<NN>-<slug>>` (two digits, lowercase-hyphen slug). The plan
directory also holds `plan-ontology.ttl` (the `plan:` vocabulary) and
`plans.shacl.ttl` (the shapes); subdirectory plans reference the vocabulary
via `../plan-ontology.ttl#`. Resolve all IRIs against the pod URL
(`BASE <http://localhost:3000/dev/plans/>` in filesystem queries).

## Writing plans

Every write must end in a validated file. The loop:

1. **Locate the write.** New plan → new `<plan-slug>/plan.ttl` in the pod
   plans container. Change to an existing plan or task → `rdf_patch` against
   that plan's file.
2. **Edit via Turtle** (`rdf_write` for new files, `rdf_patch` for surgical
   changes). Keep `dct:modified` on the plan current when its content changes
   (xsd:dateTime, UTC); entries always carry `dct:created` (xsd:date).
3. **Validate before reporting done:** `rdf_validate` with
   `dev-solid-server/data/dev/plans/plans.shacl.ttl` against the edited file. `conforms: true`
   is the completion criterion of every write — a failing shape means fix and
   re-validate, never hand back an invalid file.
4. **Status transitions** are a one-triple `rdf_patch`
   (`plan:status plan:planned` → `plan:done`, etc.). A `done` transition is
   only written when the user confirms the work is finished.

## Modelling rules

**Entries.** Values of `plan:goal`, `plan:context`, `plan:scope`,
`plan:verification`, `plan:outOfScope`, `plan:decision`, `plan:openQuestion`,
`plan:option`, `plan:note` are entry resources typed `schema:Comment`:

```turtle
<#entry-plan-decision-01> a schema:Comment;
    schema:text "Move search into core. User: \"…\"";
    prov:wasAttributedTo <https://angelo.veltens.org/profile/card#me>, <../agents.ttl#llm>.
```

- `schema:text` (exactly 1) carries the entry text; record the user's
  **intention in paraphrased form** — do not quote the user verbatim unless they
  explicitly ask for it. What matters is that the recorded intent is faithful
  and attributable, not that the exact wording survives; paraphrasing keeps
  entries compact and readable.
- **Concise, conclusion-first entries.** Each entry states one conclusion a
  human can act on — not the research trail that produced it. A note is one or
  two sentences; goals and contexts are short. When a decision supersedes
  earlier notes, condense them to their surviving conclusions instead of
  appending correction entries that restate history. Detail a human needs for
  execution goes in `plan:scope` / `plan:verification`, never as prose padding
  in a decision. When a change touches existing entries, rewrite those entries
  to current state rather than layering new entries on top.
- **Every new entry gets `dct:created`** as `xsd:dateTime` (UTC, e.g.
  `"2026-10-14T15:58:28Z"^^xsd:dateTime`) — the exact moment it was recorded.
  It powers the NEW badge in the plan viewer and makes same-day edits
  distinguishable. Older entries with `xsd:date` are grandfathered; do not
  backfill them. Historical facts whose true time is known (e.g. a commit
  timestamp) use that time.
- **Keep `dct:modified` current** on the plan and on the changed task whenever
  their content changes — as `xsd:dateTime` (UTC). The viewer compares entry
  timestamps against the owner's `dct:modified` instant: only entries created
  strictly at/after it get the NEW badge, so a comment added five minutes
  after another does not re-highlight the earlier one.
- `prov:wasAttributedTo` (min 1) records who contributed: the human via his
  WebID (`https://angelo.veltens.org/profile/card#me`), the LLM via its
  model-specific agent `<../agents.ttl#llm-<model>` (e.g.
  `<../agents.ttl#llm-glm-5.3-flash>`). Each LLM model gets its own agent in
  `agents.ttl` (IRI fragment `llm-<model>`, `rdfs:label` = model name);
  generic `<../agents.ttl#llm>` is reserved for historical entries whose
  authoring model is unknown. All agents are `foaf:Agent`; repeat per
  contributing agent. This
  replaces the former inline `[H]` / `[LLM]` markers —
  never write those markers into `schema:text` again. Qualifier prose from the
  old markers ("user confirmed", "implicitly") stays in the text.
- **Attribute by content authorship, not by who was present.** One contributor
  per entry is the default; the goal is that reading `wasAttributedTo` alone
  tells the reader *who said what*. A decision or choice the human makes is
  the human's alone — a `plan:decision` recording his choice carries only his
  WebID, even when the LLM drafted the option list or wrote the sentence. An
  entry the LLM authored (`plan:scope`, `plan:verification`, rejected-option
  rationale) carries only the LLM's agent. Use both **only** when a single
  entry genuinely interleaves verbatim human input with LLM-authored reasoning
  that can't be cleanly separated. When an entry would mix the human's choice
  with the LLM's rationale, **split it**: keep the human's choice in a
  human-attributed `plan:decision` (an inline `(chose …)` / verbatim quote
  marks his contribution), and move the LLM's design/rationale into a
  separate LLM-attributed `plan:scope` or `plan:note` entry.
- `dct:created` (0–1, xsd:date) when the entry carries a date (e.g. from a
  former `[H, clarified 2026-10-09]` marker).
- Entry IRIs: `<#entry-<subject-slug>-<prop>-<NN>>` in the plan document.
- No marker in text: don't put `[H]` or `[LLM]` in `schema:text` — attribution
  lives in `prov:wasAttributedTo`.

- One decision per `plan:decision` entry, stated normatively.
- `plan:scope` / `plan:outOfScope` / `plan:verification` / `plan:context` /
  `plan:openQuestion` / `plan:option`: one entry per triple, repeated.
- **Open questions are binary: open or gone.** A resolved question must not
  linger in the open-questions section — remove the `plan:openQuestion`
  assertion once a decision answers it, and let that decision carry the
  resolution. The section reflects *current* open state,
  not history.
- **Tasks must not start with open questions.** Before a task moves into
  implementation, every open question on it is either resolved (→ a
  `plan:decision`, assertion removed) or explicitly parked as out of scope
  (→ `plan:outOfScope` entry, assertion removed). A task that is planned
  through has an empty open-questions list; an open question on an
  in-flight task means planning is not finished.
- Every task has exactly one `plan:parent`; dependencies via `plan:dependsOn`.
- `plan:touchesFile` carries repository-relative paths — add them as you learn
  which files a task affects; they power the plan↔code queries.
- Status vocabulary is closed: `draft`, `planned`, `in-progress`, `done`,
  `deferred`, `abandoned`.
- Narrative that doesn't fit a property goes in a `plan:note` entry.
- YAGNI: never invent new `plan:` terms. If the vocabulary seems to lack
  something, stop and ask — the ontology is deliberately minimal.

## Consistency checks beyond shapes

A task may only be `done` if all its `plan:dependsOn` are `done` (check with
a SPARQL query when dependencies change — cross-resource rules are out of
SHACL's reach here). Dependency cycles: none exist today (all `dependsOn`
edges are single-hop within one plan); if chains ever grow, check with
`?task plan:dependsOn+ ?task` before reaching for more tooling.
