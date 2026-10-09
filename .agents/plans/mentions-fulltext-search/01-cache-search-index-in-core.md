# Task 01: Cache SearchIndex in core's buildSearchIndex

Status: **done**
Parent discussion: [plan.md](../plan.md), §10

## Goal — [LLM from H decisions]

Repeated calls to `os.buildSearchIndex(profile)` with the same profile return the same cached
`SearchIndex` instance instead of fetching label indexes and rebuilding every time.

## Decisions — all [H] (questionnaire, 2 rounds)

- Scope: **cache only**. No logout-clear, no DOM-event changes, no result-shape change.
- Same profile → no-op; different profile → rebuild.
- "Same profile" means comparing **`profile.webId`** (not object identity).
- **No in-flight dedup**: concurrent first calls may each build; last writer wins. Accepted wart.
- Test security: new core spec pinning caching semantics; pos-navigation suite stays green.
  Wallaby runs are executed on the user's side (LLM sandbox cannot run wallaby).

## Scope — in [LLM]

- `core/src/search/SearchGateway.ts` (or wherever the cache ends up — see open Q1)
- new/extended spec file for the caching behavior
- **no** changes to pos-navigation, DOM events, or result shape

## Out of scope (deferred, tracked in plan.md §6) — [LLM]

- Clearing cached index on logout → creates a known **stale cross-user index window**
  (re-login as another user serves the previous user's label index until a rebuild is triggered).
  Flagged as privacy-adjacent; follow-up task TBD.
- Internal rebuild on `addToLabelIndex` / `createDefaultLabelIndex`.
- Removal of `pod-os:search:index-created/updated` DOM events.
- Result shape `{ref}` → `{uri, label}`.
- os→RichEditor bridge, mention fallback.

## Implementation sketch — [LLM, pending Q1]

1. `SearchGateway` holds `private cached?: { webId: string; index: SearchIndex }`.
2. `buildSearchIndex(profile)`:
   - if `cached?.webId === profile.webId` → return `cached.index`;
   - else fetch label indexes, build `SearchIndex`, store `{ webId: profile.webId, index }`, return it.
   - empty-profile path (`labelIndexUris.length === 0`) also caches (empty `SearchIndex`).
3. `PodOS.buildSearchIndex` stays a pass-through; no API change.

## Test plan — [LLM from H decisions]

New spec (placement follows the cache location):
- same webId twice → same `SearchIndex` instance (`toBe`), one `fetchAll` call;
- different webId → new instance, second fetch;
- empty-profile path → empty `SearchIndex`, cached (same instance on repeat).

Verification: wallaby run of core suite + `pos-navigation` suite, before and after [user side].

## Review feedback — dedup + no let [H, 2026-10-09]

Angelo reviewed the landed implementation: the duplicated cache-write/return in the two branches
was consolidated, the `let` assignment he disliked was replaced by a private `buildIndex()`
helper with an early return for the empty-profile path.

## H decision — unit tests suffice for the cache [H, 2026-10-09]

The landed caching tests sat in `SearchGateway.integration.spec.ts`. Angelo challenged this:
"why do we need integration tests, i think unit would be enough for the caching feature".

Resolution [H]:
- The integration spec existed because the gateway had no test seam — not as a convention.
- Caching semantics (memoization by webId) are pure logic and are tested **unit-style** in
  `SearchGateway.spec.ts` with a fake `Store`.
- The duplicated `describe("caching")` block was **removed** from
  `SearchGateway.integration.spec.ts`; the original `build search index` integration tests remain
  there (they still cover the fetch → parse → `LabelIndex` → `SearchIndex` wiring on first build).
- Accepted trade-off: no test now asserts that the *memoized* index still searches correctly
  (the old integration test did). Considered acceptable; wiring is covered by the non-cached
  integration tests.
- The extracted pure cache class (LLM suggestion, e.g. `SearchIndexCache`) was **not** taken —
  fake-store unit tests on `SearchGateway` are sufficient. [H]

## Known consequence — none [H, 2026-10-09]

The event-triggered rebuild in pos-navigation is unaffected by the cache:
`rebuildSearchIndex()` (on `pod-os:search:index-updated`) calls `SearchIndex.rebuild()`
directly, which re-reads the label indexes from the store in place — it never goes through
`os.buildSearchIndex`.

## Open questions

1. **Cache placement** — resolved [H]: inside `SearchGateway`, as landed (it already owns build
   logic).
2. **Event-triggered rebuild bypassed by cache** — resolved [H]: not an issue,
   `SearchIndex.rebuild()` never goes through `os.buildSearchIndex` (see "Known consequence").
3. **Stale cross-user index on re-login** — resolved [H]: not an issue. The cache is keyed by
   webId, so login as a different user is a cache miss and triggers a fresh build;
   pos-navigation additionally clears its index on logout.
