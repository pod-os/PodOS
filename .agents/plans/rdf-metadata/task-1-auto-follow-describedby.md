# Task 1 — Auto-follow describedby in Store.fetch (read path)

> **Status:** Done
> **Depends on:** None (rdflib fix assumed upstream)

## Goal

After `Store.fetch(uri)`, automatically load any metadata document linked via `rel="describedby"`, so that the returned `Thing` for a binary resource is transparently enriched with its RDF metadata triples.

## Scope

- Change to `Store.fetch()` only
- After the initial fetch, query the store for:
  `<uri> <http://www.iana.org/assignments/link-relations/describedby> ?metaUrl`
- If a `?metaUrl` is found, call `store.fetch(metaUrl)` to load the metadata document into the store
- No changes to elements, gateways, or other consumers — they already operate on `Thing` objects

## Verification

- Fetch a binary resource (e.g. a PDF) from a CSS server that has a `.meta` document
- Confirm the `Thing` returned by `store.get(binaryUri)` contains metadata triples (e.g. `schema:description`, `dct:title`)

## Out of Scope

- Write path (Task 2)
- Creating `.meta` documents that don't yet exist
