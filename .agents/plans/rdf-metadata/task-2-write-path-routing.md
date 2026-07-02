# Task 2 — Write-path routing for binary resources

> **Status:** Done
> **Depends on:** None (parallel with Task 1)

## Goal

When writing triples for a `Thing` whose URI is a binary resource, route writes to the metadata document (the `describedby` target) instead of to `thing.uri.doc()`, which would point to the binary itself — an invalid SPARQL/RDF update target.

## Scope

- Extend `store.addPropertyValue()` and/or the write layer to detect when the subject URI is a non-RDF resource
- For binary resources, resolve the writable graph by following the `describedby` triple already in the store (loaded by Task 1 or a prior fetch)
- After `Store.fetch()` has loaded the `.meta` URL, `updater.editable(metaUrl)` returns true — writes can target that document
- Must fail gracefully when no `describedby` link exists (i.e. no `.meta` document)

## Verification

- Fetch a binary resource so its `.meta` is in the store
- Call `store.addPropertyValue(thing, predicate, value)` on the binary `Thing`
- Confirm the triple is written to the `.meta` document, not to the binary URI
- Confirm the write round-trips (re-fetch shows the new triple)

## Out of Scope

- Creating a `.meta` document for a binary that has none yet
- Read path (Task 1)
