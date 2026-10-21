# Test Principles

## Golden Rule

**Keep test data visible when it correlates with assertions. Extract
infrastructure, not test data.**

## Principles

1. **Preserve Given-When-Then Correlation** - If test data appears in assertions
   or drives expected behavior, keep it inline
2. **Extract Infrastructure Only** - Extract mocks, test doubles, setup. Don't
   extract test data
3. **BDD Comments Reference Visible Data** - Comments must match what's in the
   code below
4. **Extract Only for Reuse** - Don't extract for a single test; extract when 3+
   tests need it
5. **Simple Objects Stay Inline** - Objects with ≤5 parameters stay inline;
   complex objects use builders
6. **Test Observable Behavior** - assert what a unit does, not how it does it:
   no private fields, library internals, or mock-argument assertions. Wiring
   is covered by integration tests; when in doubt, delete the technical test
7. **Default Timeouts** - use `waitFor` with testing-library defaults,
   role-based queries and `userEvent`; a test needing a large timeout is
   usually wrong, not too slow
8. **Query by Role** - role-based queries survive refactoring; internal
   selectors and CSS classes do not

## Pitfalls

- **Third-party widgets may render outside the shadow root.** Libraries that
  mount popups or overlays often attach them to `document.body`. Query
  `within(document.body)` for such UI.
- **Use `withinShadow`** (`elements/src/test/withinShadow.ts`) to query inside
  a component's shadow root instead of casting `shadowRoot as HTMLElement`
  inline. The helper already contains the required cast; inline casts fail the
  Stencil build gate that integration specs go through
  (`npm run vitest:integration`).

## Quick Check

Does it appear in assertions or drive behavior? → **Keep inline**  
Is it infrastructure/mocking? → **Extract it**

## Example

```typescript
// ✅ GOOD - thing URI correlates with expected container URI
const thing = new Thing("https://pod.test/things/thing1", store);
const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
await gateway.uploadPicture(thing, file);
expect(fetcher.createNewFile).toHaveBeenCalledWith(
  expect.objectContaining({ uri: "https://pod.test/things/" }), // ← derived from thing
  file,
);

// ❌ BAD - hides the correlation between thing URI and container URI
const thing = createThing();
const file = createFile();
expect(fetcher.createNewFile).toHaveBeenCalledWith(
  expect.objectContaining({ uri: "https://pod.test/things/" }), // ← where did this come from?
  file,
);
```
