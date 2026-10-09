# Task 02: Update cached search index on label-index writes

Status: **approved — ready for implementation** (lgtm, Angelo, 2026-10-09)
Parent: [plan.md](plan.md) — post-task-01 scoping discussion (plan.md only records the plan-level
consequence: §6 DOM-event removal reopened)

## Context — deferred items and dependencies [LLM, from post-task-01 discussion]

1. Core-internal rebuild/recreate in `addToLabelIndex` / `createDefaultLabelIndex` —
   prerequisite for removing the DOM-event listener in pos-navigation.
2. Removal of `pod-os:search:index-created/updated` events — depends on (1).
3. Result shape `{ref}` → `{uri, label}` — prerequisite for the mention bridge (menu wants
   `{id, label}`). Independent of (1)/(2).
4. os→RichEditor bridge / mention fallback — deferred by user until after refactoring [H].

Ordering challenge raised [LLM]: if the real goal is re-enabling the mention extension
(disabled for the merge), the shortest path is (3) + bridge, with (1)/(2) as clean-up
afterwards. If the goal is "core is the single source of search truth first", (1)+(2) comes
first. Plan leans refactoring-first; **user chose (1)** [H].

DOM-event removal concern raised [LLM]: removal changes core's public event surface;
`elements` is published, so third-party listeners of `pod-os:search:index-updated` would
silently break. Alternative: emit from core while deprecating. User: "decide later" [H] — see
open Q3 below.

## Code facts [LLM, verified]

- `Store.get(uri)` returns a fresh wrapper but reads live from the shared rdflib store;
  `LabelIndex.getIndexedItems()` re-reads the store. So `SearchIndex.rebuild()` (which re-runs
  lunr over the *captured* `LabelIndex[]`) sees statements written after build time — as long
  as the label-index document *set* is unchanged.
- `SearchIndex` privately holds the `LabelIndex[]` captured at construction.
- `rebuild()` is called in exactly two places today: the `SearchIndex` constructor and
  pos-navigation's `pod-os:search:index-updated` listener.
- Pre-01 semantics: the `index-updated` path never refetched (shared store already had the new
  triples); the `index-created` path called `buildSearchIndex`, which refetched all label
  indexes.
- Regression [LLM, user confirmed]: task 01 (commit `47c1360a`) broke the create-default-index
  flow — post-01 the `buildSearchIndex` call is a cache hit (same webId) → stale instance, and
  a rebuild over the captured (possibly empty) `LabelIndex[]` never includes the new document.
  The user named the underlying issue [H]: the cached SearchIndex contains a *list of all label
  indexes*, so a new index document requires more than `rebuild()` — it requires building the
  cached index anew; `rebuild()` naming is confusing for that.
- Core already subscribes to session changes: `PodOS.flagAuthorizationMetaDataOnSessionChange()`
  taps `observeSession()`; the cache lifecycle can hook the same subscription.
- Only `createDefaultLabelIndex` creates a label-index document; every other write is an add
  to an existing one (`addToLabelIndex`).

## Design decisions — all [H]

- **Plain cache, no webId keying.** User challenged the webId key from task 01: "why do we
  need the cache by web id at all? only one user is logged in at a time and the cache needs to
  be cleared on logout". So the gateway holds one optional `SearchIndex`; the
  `{ webId, index }` tuple and its comparison logic are removed (small refactor of task 01's
  cache, no new functionality).
- **Cache cleared on logout** — follows directly from the same quote. Implementation goes
  through core's existing session subscription (this slice adds it there). Task 01's resolved
  open question ("cross-user staleness handled by webId keying") is thereby superseded.
- **No cache → no-op** on write paths: "if nothing cached nothing needs to be rebuilt → noop".
  Write paths never *build* an index.
- **Method-per-operation**: user challenged my discriminator options: "why so complicated.
  recreation right now is only when default index is created".
  - `addToLabelIndex` → cache exists → `rebuild()` (document set unchanged; captured
    `LabelIndex` objects read the new triples live from the store).
  - `createDefaultLabelIndex` → cache exists → **recreate**: build a fresh `SearchIndex` from
    the current `profile.getPrivateLabelIndexes()` (the `solid:privateLabelIndex` triple is
    already in the local rdflib store when the subsequent add runs).
  - This supersedes the earlier interim decision "only addToLabelIndex touches the cache".
- **Both cache updates are awaited** before the method resolves — callers get a freshness
  guarantee (unlike pre-01 event timing, which was racy).
- **Pure refactor, no new functionality**: the moved trigger is the existing
  pos-navigation `index-updated` rebuild; recreation restores pre-01 `index-created`
  refetch semantics in deterministic form (bug fix, not new behavior).
- **Core-only slice**: pos-navigation untouched; its `index-updated` listener becomes a
  harmless duplicate rebuild of the same object.

## Implementation sketch [LLM]

1. `SearchGateway`: replace `private cached?: { webId: string; index: SearchIndex }` with
   `private cached?: SearchIndex`. `buildSearchIndex(profile)` drops the webId comparison —
   cache exists → return it, else build (empty-profile path still caches an empty index).
2. `SearchGateway.addToLabelIndex(thing, labelIndex)`:
   `await store.executeUpdate(...)`, then `if (this.cached) { this.cached.rebuild(); }`.
3. `SearchGateway.createDefaultLabelIndex(profile)`: after `executeUpdate` and returning the
   `LabelIndex`, if `this.cached` exists → recreate:
   `this.cached = await this.buildIndex(profile.getPrivateLabelIndexes())` — refetches the
   label-index documents (including the new one) and constructs a fresh `SearchIndex`.
   (Reuses the existing private `buildIndex` helper.)
4. `PodOS`: in the session subscription (alongside `flagAuthorizationMetadata()`), clear the
   gateway's cache when the session ends (exact hook: add to the existing `tap` or a second
   subscription — implementation detail).
5. `os.buildSearchIndex(profile)` stays the explicit demand call with ensure-build semantics.

## Test plan [LLM]

Unit tests, fake `Store`, style of task 01 (`SearchGateway.spec.ts`):

- cache revision: `buildSearchIndex` twice → same instance (no webId assertions needed);
  after logout-simulation (cache cleared) → next call builds again.
- `addToLabelIndex` with no cache → store write happens, `fetchAll` not called, no rebuild.
- `addToLabelIndex` with cache → same instance (`toBe`), `search()` finds the added item,
  no refetch of label indexes.
- `createDefaultLabelIndex` with cache → cache is a new instance, `search()` finds an item
  added to the new index afterwards (via subsequent `addToLabelIndex` in the same test).
- `createDefaultLabelIndex` with no cache → no build.
- awaiting: promise from `addToLabelIndex` resolves only after the cache update.
- logout-clear: unit-testable via the session subject; covered at the level the existing
  `flagAuthorizationMetadata` tap is covered.

Wallaby run (user side): core suite + pos-navigation suite green.

## Open questions

1. ~~webId scoping / discriminator~~ — dissolved by the plain-cache + method-per-operation
   decisions above [H].
2. **Session-clear hook shape** — resolved direction [H]: the existing
   `flagAuthorizationMetaDataOnSessionChange` tap *could* be used, "but should probably be
   renamed" since it would then do more than flag authorization metadata. [LLM] proposal for
   the logout-clear slice: rename to `handleSessionChange()`, body delegates to named private
   reactions (`store.flagAuthorizationMetadata()`, later `searchGateway.clear()`). Exact naming
   decided when that slice is planned.
3. **DOM-event removal** (plan §6 item 4): decided [H, 2026-10-09] — "the breaking change is
   still acceptable"; remove `pod-os:search:index-created/updated` in a slice after task 02.
   [LLM inference: the deprecate-while-emitting alternative seems moot given core owns index
   freshness after task 02 — not explicitly confirmed by the user.]
4. **`filesToCreate: []` in `createDefaultLabelIndex`**: the returned operation lists no files
   to create even though the target file may not exist yet (presumably the solid server
   creates it on PUT — to verify). Does not affect gateway logic; noted.
5. **Logout-clear timing vs in-flight build**: if `buildSearchIndex` is mid-flight during
   logout, the clear must not be overwritten by the completing build (task 01 accepted
   "no in-flight dedup"; the clear adds a stale-write race). [LLM leaning: acceptable wart for
   now, same precedent as task 01 — flag, don't engineer.]
