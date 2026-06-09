# RDF Metadata for Non-RDF Resources

> **Status:** Draft
> **Created:** 2026-06-09

## Problem Statement

Users want to annotate non-RDF resources — such as PDF documents, images, or
other binary files stored on a Solid Pod — with RDF metadata. Currently PodOS
has no mechanism to attach structured, queryable data to resources that are not
themselves RDF documents, making it impossible to describe, tag, or relate those
resources within the Linked Data graph.

## Solution

Follow the [Solid Protocol auxiliary resource spec](https://solidproject.org/TR/protocol#auxiliary-resources).
When a binary resource is fetched, the server advertises its metadata document
via a `Link: <meta-url>; rel="describedby"` HTTP response header. PodOS fetches
that metadata document into the rdflib store, so that `store.get(binaryUri)`
returns a `Thing` transparently enriched with all metadata triples — no
special-casing required above the `Store` layer.

The dev server (Community Solid Server) already emits `rel="describedby"` and
serves `.meta` documents. The mechanism is confirmed working end-to-end: after
loading `test.pdf` and `test.pdf.meta`, the rdflib store holds 20 triples about
the PDF including `schema:description`, `dct:title`, and `dct:format`.

## User Stories

1. As a Pod owner, I want to attach a title and description to a PDF stored on
   my Pod, so that I can identify and search for it alongside my other linked
   data.
2. As a Pod owner, I want to tag an image with RDF predicates (e.g. subject,
   date taken), so that I can browse and filter my photos by metadata.
3. As a dashboard developer, I want `pos-label` and `pos-value` to work on
   binary resources the same way they work on RDF documents, so that I do not
   need to handle non-RDF resources specially in my markup.

## Implementation Decisions

### Convention for linking metadata to a binary resource

Use the Solid Protocol auxiliary resource mechanism: `Link: rel="describedby"`.
The metadata document URL is server-assigned (CSS uses a `.meta` suffix, e.g.
`image.jpg.meta`). PodOS does not hardcode any suffix convention.

### How PodOS discovers the metadata URL

After `store.fetch(binaryUri)`, rdflib parses the `Link` header and stores:

```turtle
<binary> rdfs:seeAlso <binary.meta> .
```

However `rdfs:seeAlso` is also used for hand-authored links, so auto-following
it blindly is unsafe. The correct predicate to follow would be:

```
http://www.iana.org/assignments/link-relations/describedby
```

This requires an upstream fix to rdflib — tracked in
[linkeddata/rdflib.js#741](https://github.com/linkeddata/rdflib.js/issues/741).
Assuming that fix lands, `Store.fetch()` can safely auto-follow any
`link-relations/describedby` triple it finds after loading a URI.

### Changes to `Store.fetch()`

After the upstream rdflib fix, extend `Store.fetch(uri)` to:

1. Fetch the URI as today.
2. Query the store for `<uri> <link-relations/describedby> ?metaUrl`.
3. If found, call `store.fetch(metaUrl)` to load the metadata document.

This keeps the enrichment transparent — callers, gateways, and elements need no
changes.

### Write path for metadata

`store.addPropertyValue(thing, predicate, value)` currently graphs triples into
`sym(thing.uri).doc()`. For a binary URI that resolves to the binary itself —
which is not a valid SPARQL/RDF update target. For non-RDF resources, writes
must be directed to the `.meta` document instead.

`Store.fetch()` already loads the `.meta` URL into the store. After that,
`updater.editable(metaUrl)` returns true (it is a Turtle document), so writes
can be sent there. The store needs a way to determine, for a given `thing.uri`,
which graph to write into — defaulting to `thing.uri.doc()` for RDF resources
and to the `describedby` URL for binary resources.

### Changes to PodOS elements

No changes required if `Store.fetch()` handles the metadata fetch transparently.
Existing elements (`pos-label`, `pos-value`, `pos-list`, etc.) operate on
`Thing` objects; as long as the metadata triples are in the store they will
surface them automatically.

## Out of Scope

- Uploading or replacing binary file content (already handled by `FileFetcher`).
- Indexing metadata for full-text search (overlap noted, but separate feature).
- Supporting servers that do not implement auxiliary resources.
- Creating a `.meta` document for a binary that has none yet (write-new, not
  write-update; may be addressed in a follow-up).

## Further Notes

### Upstream dependency

The auto-follow behaviour in `Store.fetch()` is blocked on the rdflib fix.

### Related

- [linkeddata/rdflib.js#741](https://github.com/linkeddata/rdflib.js/issues/741) — upstream rdflib bug to fix
- [Full Text Search feature](../../docs/features/full-text-search.md) — also relies on RDF labels
  attached to resources, may overlap with indexing strategy.
- [ADR-0003 – Handle data with rdflib.js](../../docs/decisions/0003-handle-data-with-rdflibjs.md)
- [ADR-0016 – RDFa alignment](../../docs/decisions/0016-rdfa-alignment.md)
