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
  `plan:note`) — narrative detail lives in the graph.

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
   changes). Keep `dct:modified` on the plan current when its content changes.
3. **Validate before reporting done:** `rdf_validate` with
   `dev-solid-server/data/dev/plans/plans.shacl.ttl` against the edited file. `conforms: true`
   is the completion criterion of every write — a failing shape means fix and
   re-validate, never hand back an invalid file.
4. **Status transitions** are a one-triple `rdf_patch`
   (`plan:status plan:planned` → `plan:done`, etc.). A `done` transition is
   only written when the user confirms the work is finished.

## Modelling rules

- One decision per `plan:decision` value, stated normatively; preserve verbatim
  user quotes inline inside the value (this is how human intent survives —
  never paraphrase a quote into your own words).
- `plan:scope` / `plan:outOfScope` / `plan:verification` / `plan:context` /
  `plan:openQuestion` / `plan:option`: one item per triple, repeated.
- Every task has exactly one `plan:parent`; dependencies via `plan:dependsOn`.
- `plan:touchesFile` carries repository-relative paths — add them as you learn
  which files a task affects; they power the plan↔code queries.
- Status vocabulary is closed: `draft`, `planned`, `in-progress`, `done`,
  `deferred`, `abandoned`.
- Narrative that doesn't fit a property goes in `plan:note`.
- YAGNI: never invent new `plan:` terms. If the vocabulary seems to lack
  something, stop and ask — the ontology is deliberately minimal.

## Consistency checks beyond shapes

A task may only be `done` if all its `plan:dependsOn` are `done` (check with
a SPARQL query when dependencies change — cross-resource rules are out of
SHACL's reach here). Dependency cycles: none exist today (all `dependsOn`
edges are single-hop within one plan); if chains ever grow, check with
`?task plan:dependsOn+ ?task` before reaching for more tooling.
