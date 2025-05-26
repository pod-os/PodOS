# Read-only offline access to RDF Data

## Status

Accepted

## Context and Problem Statement

The application uses [`rdflib.js`](https://github.com/linkeddata/rdflib.js) to load and manage RDF data from Solid Pods. To support a better user experience, especially in low-connectivity or offline situations, the application should provide read-only access to previously loaded data when the user goes offline.

The goal is to design this in a way that will later support **offline writes and synchronization** as a natural extension.

This topic has been previously discussed in the context of both Solid Project and other projects:
 - [Native support in rdflib.js](https://github.com/linkeddata/rdflib.js)
 - [RemoteStorage Caching](https://remotestoragejs.readthedocs.io/en/v1.2.3/contributing/internals/cache-data-format.html)
 - [CRDTish approach to Solid](https://forum.solidproject.org/t/request-for-comments-crdtish-approach-to-solid/4211)
 - [Local-first in Soukai](https://soukai.js.org/guide/advanced/local-first.html#local-first)

An experimental version of caching in a service worker [has been implemented by jg10](https://jg10.solidcommunity.net/notes/sw.js).

## Considered Options

### Full Store Dump (e.g. localStorage or IndexedDB)

**Approach:** On every update, serialize the entire in-memory rdflib.js store and save it to persistent storage (e.g. `IndexedDB` or `localStorage`). On startup or reload, deserialize and restore.

* **Pros:**

  * Simple to implement with rdflib’s `serialize()` and `parse()`.
  * Keeps all triples together — ideal for small to medium data sets.
  * Minimal changes to rdflib usage.

* **Cons:**

  * Does not scale well: full serialization/deserialization becomes slow with growing datasets.
  * No granularity: hard to determine what changed for future sync.
  * Prone to race conditions if writes or loads happen in parallel.
  * Not optimal for partial access (e.g., per document).

**Rejected** due to poor scalability and difficult extension toward partial sync or offline editing.

### Caching RDF Documents Individually (Named Graph-Based)

**Approach:** Cache each RDF document (i.e. each Solid resource URL) as a separate unit. Leverage the fact that rdflib associates documents with Named Graphs. Intercept fetch calls (`rdflib.fetcher.load`) and return cached responses if offline.

* **Pros:**

  * Natural fit for Solid Pod structure (1 URL = 1 document = 1 Named Graph).
  * Scales well: only needed documents are cached.
  * Granularity allows intelligent updates and easier conflict resolution later.
  * Offline read access can use the same logic as online fetch, just with fallback.
  * Cached documents could be stored as n-triples, no matter the original format.
  * Supports different caching backends like indexedDB in Browser or file system in Node.js.
  * Can be extended to support a CRDT approach

* **Cons:**

  * Requires custom logic to wrap or shim rdflib's fetcher.
  * The rdflib Updater would also need to be modified to support offline writes.
  * Slightly more complex initial implementation.
  * Still needs decisions about storage format and cache eviction policy.
  * Only works when using the rdflib fetcher, not when using fetch directly.
  * Only covers RDF documents, not other resources (e.g., images, files).
  * Does not run in service worker and thus cannot sync after the app is closed.

**Considered.** Provides a scalable, modular, and future-proof architecture.

### Service Worker-Based Cache (HTTP Caching of RDF Files)

**Approach:** Use a Service Worker to intercept HTTP fetches and return cached RDF documents when offline, using the browser’s `CacheStorage`.

* **Pros:**

  * Easy to set up with Workbox or native API.
  * Can cache any HTTP resource, not just RDF documents.
  * Works with any fetch call, not just rdflib.
  * Offline-writes could use a [keep-revert conflict resolution](https://remotestoragejs.readthedocs.io/en/v1.2.3/contributing/internals/cache-data-format.html#keep-revert-conflict-resolution]).
  * Can do background sync for offline writes.

* **Cons:**

  * Lacks insight into rdflib or RDF document structure, so RDF-graph based merging strategies would need completely separate implementation later.
  * By design would pass through PATCH requests as this solution has no natural mechanism to inspect and process n3/patch or sparql/update. Offline support would need to come from a separate cache layer.
    * This problem might be mitigated by the fact, that rdflib.js updates the store after a (seemingly) successful request.
    * Yet if refreshing the page, the rdflib store gets lost and the cache is not up-to-date.
  * Is based on browser's service worker and will not work in Node.js out of the box.
  * Offline cache needs to store different serialization formats (e.g., Turtle, RDF/XML, JSON-LD).

**Rejected** The need for a separate cache to handle offline PATCH requests and maintain cache consistency makes this approach less suitable for future offline write support.

## Decision Outcome

We will implement a **custom rdflib.js fetcher shim**, which:

* Intercepts RDF document fetches.
* If online, fetches normally and optionally caches the result.
* If offline, serves a previously cached version of the document (if available).
* Uses the document URL as the cache key (one document = one cache entry).
* Can later support write operations and synchronization logic.

The cache backend will be implemented using `IndexedDB` storing RDF documents in their serialized form.

## Consequences

### Positive Consequences

* **Granular caching**
  Each RDF document is cached individually, enabling selective access and updates. Aligns naturally with Solid’s document-based model.

* **Future-Proof for offline writes**
  The architecture supports the possibility of storing offline edits per document and syncing them when online, without rearchitecting the caching strategy.

* **Clean Integration with rdflib.js**
  By shimming the `rdflib.fetcher`, the API and developer experience remain unchanged for consumers of the library.

* **Scalability**
  Caching at the document level scales better than dumping and restoring the entire RDF store, especially as user data grows.

* **Flexibility**
  The caching strategy can be adapted to different backends (indexedDB, file system, etc.) and does not work only in the browser.

### Negative Consequences

* **Increased implementation complexity**
  Requires custom logic to wrap or override rdflib’s fetcher, plus a caching layer in `IndexedDB` or similar.

* **rdflib specific solution**
  Needs to be adjusted or reimplemented if the underlying RDF library changes some day.

* **Limited to RDF documents**
  Offline access to other resources (e.g., images, files) will not work in the first iteration.

* **Background sync complexity**
  Implementing background sync will require additional logic to involve a service worker or similar mechanism.