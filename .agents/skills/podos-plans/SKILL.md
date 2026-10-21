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
`plan:active` pointer in `<pod>/plans/active.ttl` — resolve it with
`queries/active-plan.sparql`. The HTML viewer
(`http://localhost:3000/dev/plans/index.html` with the dev server running,
via `npm run dev:server`) renders the active plan as a board with full-screen
task detail; when starting or resuming work, check or set this pointer first.

## Reading plans

**Queries first — the rules for this skill, in order:**

1. **Before writing any SPARQL, run `discover_sparql_queries`** (or look in
   `.agents/skills/podos-plans/queries/`) — proven query files there
   already encode the vocabulary, prefixes and patterns that work against the
   pod. Reuse one, wrapped in a `GRAPH` pattern (below), whenever the
   question matches. Prefer `queries/next-work.sparql` and
   `queries/open-tasks-by-plan.sparql` for "what is next / what is open".
2. **Never invent a prefix block from memory — copy it from the query files.**
   The canonical block:

   ```sparql
   PREFIX plan:   <http://localhost:3000/dev/plans/plan-ontology.ttl#>
   PREFIX dct:    <http://purl.org/dc/terms/>
   PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
   PREFIX schema: <https://schema.org/>
   PREFIX prov:   <http://www.w3.org/ns/prov#>
   ```

   Two silent-trap variants: the pod uses the **HTTPS** form for `schema:`
   (not the conventional `http://schema.org/`), and `plan:` lives on the
   **localhost pod**, not the published ontology IRI. A wrong-variant prefix
   does not error — the query silently returns nothing; a **missing** prefix
   does error — undeclared, the parser fails. Both fail before any data is
   read.
3. **Match IRI form to the query context.** Relative IRIs (`<#entry-...>`,
   `<../agents.ttl#llm-...>`) are document-idiom: legal in the plan's Turtle,
   where the base resolves at parse time. A standalone SPARQL query has no
   base IRI — relative forms fail to parse ("expected IRI parsing failed")
   and the store only holds absolute IRIs. In queries, always write the
   resolved absolute form:
   `<http://localhost:3000/dev/plans/<plan-slug>/plan.ttl#entry-...>`.
4. **Only write ad-hoc SPARQL when no existing query fits.** If you must,
   start from the closest existing file's prefix block and patterns, not
   from scratch.

## Reading plans (mechanics)

Read over HTTP with **ld_fetch + rdf_memory_query**, never from the
filesystem (`file://` paths differ per checkout — the `plan:` prefix cannot
match across machines). Every fetched document lands in its own named graph
(see the linked-data-fetch skill); queries must therefore scope to graphs.

**1. Fetch.** Fetch every document you want to query into the `fetched-data`
store:

- The plan container listing — `ld_fetch http://localhost:3000/dev/plans/`
  — to discover plan directories (`ldp:contains`; each directory holds a
  `plan.ttl`).
- Each plan's document — `ld_fetch http://localhost:3000/dev/plans/<plan-slug>/plan.ttl`
  — becomes `GRAPH <http://localhost:3000/dev/plans/<plan-slug>/plan.ttl>`.
- `active.ttl` only for the active-plan query (see below).

Re-fetching the same URI atomically replaces its graph — use it to refresh
after a write or when data may be stale.

**2. Query.** The query files carry no `GRAPH` clauses — their bare triple
patterns match nothing in `fetched-data` (the default graph is always
empty). Before running one, wrap its whole body in a graph pattern. For
queries that should span **all fetched plans**, use the variable-graph form
with a plan-prefix filter (keeps unrelated fetched documents out):

```sparql
GRAPH ?g {
  <query-file body, verbatim>
  FILTER(STRSTARTS(STR(?g), "http://localhost:3000/dev/plans/"))
}
```

For queries scoped to **one plan**, substitute the concrete graph:
`GRAPH <http://localhost:3000/dev/plans/<plan-slug>/plan.ttl> { <body> }`.
Verify the exact graph IRI in the ld_fetch result — never reconstruct it.

**Default to querying over ALL plans.** Fetch every plan file discovered
from the container listing. Do NOT chase the active-plan pointer:
the cross-graph active-plan query needs every plan fetched anyway, and a
missing plan graph makes the query silently return empty — indistinguishable
from "no data". Determine the plan being worked on from the data itself:
plans with `plan:status plan:in-progress` (see
`queries/in-progress-plans.sparql`), or `queries/open-tasks-by-plan.sparql`
for where open work lives. The `active.ttl` pointer is what the HTML viewer
switches on — it is secondary for agents; read it only when explicitly asked
what the viewer shows. Then customize the query when the question doesn't
match: narrow FILTERs, fill the `<path fragment>` / `<YYYY-MM-DD>`
placeholders, blend pieces of two files.

- Status filtering uses full IRIs; display is nicer with
  `STRAFTER(STR(?status), "#")` (see the queries).
- Table output truncates long `schema:text` cells; use `format: "csv"` for full
  text, or re-run narrower queries.
- Hash-URI fetches (`plan.ttl#task-…`) still store the whole document in
  `GRAPH <plan.ttl>` — query that graph; never re-fetch for a fragment.
- Next work: `queries/next-work.sparql` — open tasks (draft, planned,
  in-progress) whose `plan:dependsOn` are all `plan:done`. A `plan:draft`
  task in the result means the next step is planning it through (resolve or
  park its open questions, write scope/verification), not implementation.
- Plan code impact: `queries/tasks-touching-file.sparql` with a path.
- Full context: for a single plan, query everything about it
  (`plan:context`, `plan:decision`, `plan:openQuestion`, `plan:option`,
  `plan:note` — each resolving to schema:Comment entries) — narrative detail
  lives in the graph.

- For human browsing, open the HTML viewer — there are no markdown views.
- `queries/active-plan.sparql` is the one cross-graph join: fetch `active.ttl`
  (graph `<http://localhost:3000/dev/plans/active.ttl>`) **and** all plan
  files, then run its plan-side body inside `GRAPH ?g` (with the prefix
  filter) joined against a fixed
  `GRAPH <http://localhost:3000/dev/plans/active.ttl> { ?active plan:active ?plan }`.
  Not the default path — the pointer can be stale or unset while work
  continues.
- Before writing an ad-hoc query, check what predicates exist:
  `rdf_schema_overview` (with `store: "fetched-data"` once the plan documents
  are fetched) or read `dev-solid-server/data/dev/plans/plan-ontology.ttl`.
  Unknown properties return empty results, not errors — and an empty result
  from an ad-hoc query means suspect the query (wrong prefix or wrong IRI,
  see rules 2–3) before concluding "no data".

IRIs: relative to each plan document — plan `<plan.ttl#plan>`, task
`<plan.ttl#task-<NN>-<slug>>` (two digits, lowercase-hyphen slug). Every plan
directory resolves `plan-ontology.ttl` to the same absolute IRI, so the
shared `plan:` prefix in the queries works for any plan at any depth.

## Writing plans

Every write must end in a validated file. The loop:

1. **Locate the write.** New plan → new `<plan-slug>/plan.ttl` in the pod
   plans container. Change to an existing plan or task → `rdf_patch` against
   that plan's file.
2. **Edit via Turtle** (`rdf_write` for new files, `rdf_patch` for surgical
   changes). Keep `dct:modified` on the plan current when its content changes
   (xsd:dateTime, UTC); entries always carry `dct:created` (xsd:date).
3. **Validate before reporting done:** `rdf_validate` with
   `dev-solid-server/data/dev/plans/plans.shacl.ttl` against the edited file.
   `conforms: true` is the completion criterion of every write — a failing
   shape means fix and re-validate, never hand back an invalid file.
4. **Status transitions** are a one-triple `rdf_patch`
   (`plan:status plan:planned` → `plan:done`, etc.). A `done` transition is
   only written when the user confirms the work is finished.
5. Writes go through the filesystem; the pod picks them up on the next
   HTTP read — re-fetch the edited document with `ld_fetch` to see the
   change in `fetched-data`.

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
- **Cross-entry references are explicit triples, never prose.** When an entry
  relates to another entry ("per decision-04", "see task-07 note-06",
  "supersedes task-01 outOfScope-04"), assert it with
  `dct:references <#entry-...>` and drop the slug from the prose. Rewrite the
  sentence so it reads standalone: name the thing in words ("supersedes the
  deferred result-shape ruling", "with the session-handling decision") instead
  of bare "decision-05"/"note-06" — a reader without IRI knowledge must not
  depend on the slug. The viewer renders `dct:references` as clickable chips
  that jump to (and flash-highlight) the referenced entry, opening its task
  sheet if it lives in another task. Note that entry numbering is not stable:
  decisions/scope entries get renumbered and removed during plan evolution, so
  prose slugs rot — a dangling "Per decision-04" is unreadable once the
  referenced entry is gone.
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

- One decision per `plan:decision` entry, stated normatively — the
  `documenting-decisions` skill defines what the text of a decision carries
  and what stays out. Apply it when creating a decision entry and when
  reviewing or rewriting existing ones.
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
