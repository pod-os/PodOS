# Read-only offline access to RDF Data

## Status

Considered

## Context and Problem Statement

The application uses [`rdflib.js`](https://github.com/linkeddata/rdflib.js) to load and manage RDF data from Solid Pods. To support a better user experience, especially in low-connectivity or offline situations, the application should provide read-only access to previously loaded data when the user goes offline.

The goal is to design this in a way that will later support **offline writes and synchronization** as a natural extension.

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

* **Cons:**

  * Requires custom logic to wrap or shim rdflib’s fetcher.
  * Slightly more complex initial implementation.
  * Still needs decisions about storage format and cache eviction policy.

**Considered.** Provides a scalable, modular, and future-proof architecture.

### Service Worker-Based Cache (HTTP Caching of RDF Files)

**Approach:** Use a Service Worker to intercept HTTP fetches and return cached RDF documents when offline, using the browser’s `CacheStorage`.

* **Pros:**

  * Easy to set up with Workbox or native API.
  * Automatically handles network fallback.

* **Cons:**

  * Lacks insight into rdflib or RDF document structure.
  * Hard to coordinate with `rdflib.fetcher` logic.
  * Not suitable for offline editing or triple-level diffs later.
  * Limited control over cache invalidation and versioning.

**Rejected** due to lack of flexibility and poor alignment with RDF logic.

## Decision Outcome

We will implement a **custom rdflib.js fetcher shim**, which:

* Intercepts RDF document fetches.
* If online, fetches normally and optionally caches the result.
* If offline, serves a previously cached version of the document (if available).
* Uses the document URL as the cache key (one document = one cache entry).
* Can later support `save()` and synchronization logic.

The cache backend will be implemented using `IndexedDB` (or similar), storing RDF documents in their serialized form.

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

* **Custom cache policies possible**
  Enables advanced strategies like eviction, versioning, or freshness indicators on a per-document basis.

### Negative Consequences

* **Increased implementation complexity**
  Requires custom logic to wrap or override rdflib’s fetcher, plus a caching layer in `IndexedDB` or similar.

* **rdflib specific solution**
  Needs to be adjusted or reimplemented if the underlying RDF library changes some day
