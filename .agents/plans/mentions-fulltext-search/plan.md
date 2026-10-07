# Discussion: RichEditor mentions ← full-text search (refactor first)

Topic (verbatim, human): > instead of hard-coded items in RichEditor markdown mentions, i want to have
a full text search from the search index, same as in pos-navigation

Rules: no code changes except this notes file. Genuine human contributions are marked **[H]**,
LLM-derived analysis/extrusions marked **[LLM]**.

---

## 1. Current state (facts from code) — [LLM]

- Hard-coded mention items: `elements/src/components/pos-markdown-document/rich-editor/mention-extension/items.ts`
  returns Alice/Bob/Carol (`http://localhost:3000/.../card#me`), filtered by label substring client-side.
- Mention menu: `pos-mention-menu` renders `MentionItem { id, label }[]`, tiptap suggestion char `#`.
- pos-navigation search chain: on login → `os.buildSearchIndex(session.state.profile)`
  (`core/src/search/SearchGateway.ts`) → fetches **private label index** files from the pod →
  `SearchIndex` (lunr, indexes `uri` + `label`, prefix/suffix/infix ranking in `search(term, maxResults=10)`).
- Lifecycle signals exist as DOM events: `pod-os:search:index-created` / `pod-os:search:index-updated`,
  emitted by `pos-make-findable`, consumed by pos-navigation (`rebuildSearchIndex()`).
- On logout pos-navigation calls `searchIndex.clear()`.
- **The index is component-local state, not a shared service.** pos-navigation owns its instance.
- `pos-markdown-document` has **no PodOS awareness** today (no `pod-os:init`, no session subscription);
  `RichEditor` is a plain TS class constructed inside it with no `os` reference.
- Result shape mismatch: navigation gets `{ ref }` (uri); mention menu wants `{ id, label }`. Adapter needed.

## 2. Terminology challenge — [LLM]

"Full text search" is a mislabel for what the index does: it indexes **labels and URIs only**, not
document content. What the mentions feature actually wants is *label search over findable things*.
If real full-text (document bodies) is ever wanted, that is a different index (different corpus,
different pod files, different privacy story). Decided to keep the scope as label search **[H — implicitly,
no objection raised so far]**.

## 3. User's framing — [H, verbatim]

> For sure we need a refactoring first and we should plan this now before diving deeper into the mentions feature.
> the question is where to build the search index and whether we need to "globalize" it

## 4. Refactoring options (where to build / globalize the index) — [LLM]

### A. Core-owned search service
`PodOS` (core) holds a `SearchIndex` instance; lifecycle: built on login (core already receives
`buildSearchIndex(profile)` calls today), invalidated/rebuilt on label-index change events,
cleared on logout. Consumers call `os.search(term)` synchronously.

- + lunr + LabelIndex logic already live in core; single source of truth; one fetch, one rebuild.
- − core must know about session/login lifecycle or get an explicit `initSearch(profile)` call;
  introduces stateful lifetime into an otherwise stateless-ish facade.
- − elements must still bridge `os` → RichEditor (RichEditor has no os reference; needs a
  `suggestionsProvider` callback or similar injected at construction).

### B. Shared service in elements package (session store or small singleton module)
A tiny module in `elements/src` owns index lifecycle (subscribe session + index events once),
exposes an observable / query function. Core API stays as-is.

- + core stays thin; consumers live in elements anyway; no core API surface change.
- − "singleton module" is hidden global state; harder to test; two search entry points
  (`os.buildSearchIndex` still exists) can drift.

### C. Status quo pattern (per-component build)
pos-markdown-document subscribes `pod-os:init` + session like pos-navigation and builds its own index.

- + least refactoring, proven pattern, testable in isolation.
- − N× label-index fetches + N× lunr rebuilds; staleness wiring duplicated per consumer;
  RichEditor still needs the bridge; with a third consumer this clearly breaks down.

### Middle path [LLM]
Lifecycle correctness (one owner of build/rebuild/clear, others just query) matters more than
*where* the instance lives. Both A and B can satisfy it; A puts the truth in core, B in elements.

## 5. Decisions so far — [H unless noted]

- **Move search into core.** User: "I think it makes sense to move it into core, since it is not a UI
  feature? even cli apps could make use of the search?"
- **Core owns lifecycle (A-full).** Inferred from the user's core argument + headless-first choice.
- **Build lazily on demand, not eagerly on login.** User: "i think it should be lazy, but not on first
  search, but as soon as a component needs it. like pos-navigation or the mention"
- **Demand signal: any consumer mount** (user chose, [H]) — i.e. first consumer to register need
  triggers one shared build; consumers share the index.
- **Keep warm until logout.** User: "keep warm." Plus [LLM]: invalidation on label change is an
  *existing* mechanism, not a new feature: `pos-make-findable` already writes via core
  (`os.addToLabelIndex` / `os.createDefaultLabelIndex`) and only then echoes DOM events
  (`pod-os:search:index-updated/created`) which pos-navigation consumes. With core-owned index,
  core can rebuild inside those gateway methods; DOM-event listeners become redundant.
- **Keep `os.buildSearchIndex(profile)` as the explicit demand call [H].** User: "why should we remove
  os.buildSearchIndex, i would still keep it explicit". New semantics [LLM]: de-duplicated
  ensure-build returning the shared instance — the demand signal *is* the existing method. No
  refcount API needed. Edge [LLM]: de-dup keyed on session profile; same-profile repeat calls are
  no-ops; profile change (re-login) rebuilds. All current consumers pass `session.state.profile`,
  so this matches practice.
- **Core rebuilds internally on label changes [H]** (user confirmed):
  `addToLabelIndex` / `createDefaultLabelIndex` update the core-held index directly;
  DOM-event listeners in pos-navigation become redundant.
- **Remove `pod-os:search:index-created/updated` DOM events [H]** (user confirmed; breaking but
  contained — only in-repo consumers).
- **Defer os→RichEditor bridge and mention fallback [H]** — user: "focus on refactoring, we will
  discuss after that" / "later".
- **Headless-first design [H].** Core API must work without DOM; CLI/non-UI consumers usable from
  day one.
- Scope guardrail [H]: "lets not add new things and focus on refactoring" — pure
  deduplication/refactor of existing behavior, no new features.

## 6. Emerging plan (A-full, draft) — [LLM, pending user confirmation]

1. Core: `PodOS` holds a `SearchIndexService` (name TBD) — builds lazily when first consumer
   expresses need, shared thereafter; cleared on logout (via
   `observeSession()`, which core already subscribes to); updated internally by
   `addToLabelIndex` / `createDefaultLabelIndex`.
2. Core API: `os.search(term, maxResults?)` → canonical result shape `{uri, label}[]`
   (pos-navigation currently reads `{ref}` — its rendering/tests change accordingly) [LLM].
3. Elements: pos-navigation stops building its own index; stops listening to
   `pod-os:search:*` rebuild events.
4. DOM events `pod-os:search:index-created/updated`: **remove [H]** — user confirmed, breaking
   but contained (only in-repo consumers).
5. `os.buildSearchIndex(profile)` stays public, becomes the explicit demand call with ensure-build
   semantics.
6. os→RichEditor bridge and mention fallback: explicitly deferred by user — "focus on refactoring,
   we will discuss after that" / "later" [H]. Not part of the refactor plan.

## 7. Open questions

1. os→RichEditor bridge design — deferred to post-refactor discussion [H].
2. Mention fallback for things not in the index — deferred [H].
3. Naming of core search service class — TBD during implementation planning.

## 8. Decision log

- Search moves to core; core owns lifecycle; lazy demand-based build; keep warm until logout;
  headless-first. [H]

## 8. Merge strategy discussion — [H + LLM]

Context [LLM]: branch `feat/markdown-mentions` is 15 commits ahead of main; latest commit
b50b5975 contains this plan doc. Exposure analysis: the hardcoded suggestion menu (Alice/Bob/Carol
on `localhost:3000`) only appears when a user with edit permission enters edit mode and types `#`;
view mode and stored mention markdown (`[@ id=... label=...]` → `pos-rich-link`) don't touch
`items.ts`. But `elements` is published and `pos-document`/`pos-app-document-viewer` pass
`editable` through — downstream editors would see fake suggestions and could insert broken URIs.

Decision [H]: disable the mention extension before merging; skip affected tests until the
extension returns. User: "i would like to remove the mention extension from the editor. tests might
break. i have no better idea to skip those then until the extension is back in" / "disable ext.
skip affectedf tests" / "Skip via .skip".

Details agreed [H with LLM analysis]:
- Unregister `mention()` in `RichEditor.ts` (disable-on-branch variant: commit on
  `feat/markdown-mentions`, merge tip to main — avoids future revert/conflict dance).
- The 3 registration-tied tests in `RichEditor.spec.tsx` (Mentions describe block: render with char,
  render without char, round-trip) get `.skip` treatment [H chose .skip over delete-and-restore;
  LLM had argued delete-and-restore is cleaner but the user decided].
- Standalone tests (`render.spec.tsx`, `pos-mention-menu.spec.tsx`, 42 tests total pass currently)
  keep running — they don't depend on registration.
- Mention rendering/serialization code (`PosRichLinkMark`, markdown syntax) stays on main, inert.
- Re-add path: when the search-based provider lands (post-refactor feature phase), the extension is
  re-registered and the 3 skipped tests are un-skipped.
- Housekeeping before merge: commit the plan-file move (old `.agents/plans/mentions-fulltext-search.md`
  shows `AD` in working tree).

**Status: applied [LLM]** — disable commit made on `feat/markdown-mentions`
(disable commit hash follows), RichEditor suite green (39 passed / 3 skipped / 0 failed),
LSP diagnostics clean. Pending: commit plan-file move, then merge tip to main.

## 9. Notes location

- This file: `.agents/plans/mentions-fulltext-search/plan.md` (user chose dir; moved into a
  plan-specific subdir to allow task breakdown later, like `.agents/plans/rdf-metadata/` [H])
