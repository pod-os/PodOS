---
name: migrate-jest-to-vitest
description: Migrate a stencile component unit test (spec.tsx) from Jest to Vitest.
---

The user will instruct you exactly what to do. Do only that, then document that into this skill. Do not try to solve
problems on your own. Follow the described path and delegate anything that comes unexpected to the user.

## CRITICAL: Execute steps mechanically — do not think ahead

Each step below is a mechanical, self-contained action (rename a file, add imports, replace a snippet). Execute
**only the current step**. Do NOT:

- Read the component source, other vspec files, or the codebase "for reference" before a step.
- Reason about which pattern to use, anticipate later steps, or pre-empt the user.
- Combine multiple steps in one turn.

**If you feel yourself starting to analyse or plan beyond executing the literal current step, STOP and ask the user
what to do.** Do not proceed on your own initiative. Thinking is a signal to pause, not to act.

## IMPORTANT: Self-improve after user feedback

After you apply an instruction the user gives you to the test file, update this skill file to document what
you just did as a new numbered step — but **only when the user gives feedback** (e.g. corrects your approach,
clarifies a step, or points out something unexpected). Do not self-improve after every step that works as
expected. The documentation step captures lessons learned, not routine successful execution.

Do not wait for the user to say "self-improve" or "IMPORTANT: Self-Improvement". The documentation step is
part of the task, not an afterthought.

## Steps

### Step 1: Rename the test file to `.vspec.tsx`

Use `git mv` to rename the Jest spec file (`*.spec.tsx` / `*.spec.ts`) to the Vitest naming convention
(`*.vspec.tsx` / `*.vspec.ts`). `git mv` preserves history.

```bash
git mv path/to/file.spec.tsx path/to/file.vspec.tsx
```

Verify the rename landed, then self-improve and await the user's next instruction.

### Step 2: Add the Vitest imports

At the top of the renamed file, add these imports before the existing imports:

```ts
import { vi } from 'vitest';
import { beforeEach, afterEach, describe, expect, it, render, h } from '@stencil/vitest';
```

### Step 2b: Replace `jest-when` with `vitest-when`

If the test uses conditional mock return values via `jest-when`, swap the import:

```ts
// before
import { when } from 'jest-when';
// after
import { when } from 'vitest-when';
```

`vitest-when` is a drop-in import replacement, but its API differs from `jest-when`: replace
`.mockReturnValue(...)` with `.thenReturn(...)`. Similarly, `.mockResolvedValue(...)` → `.thenResolve(...)` and
`.mockRejectedValue(...)` → `.thenReject(...)`. The `when(fn).calledWith(...)` prefix is unchanged. The mocks must be
`vi.fn()` instances.

### Step 2c: Replace `jest.mock` / `jest.fn` with `vi.mock` / `vi.fn`

If the test uses Jest's module mocking (`jest.mock('module', factory)`) or `jest.fn()` mocks (e.g. an event listener
spy), convert them to their Vitest equivalents. `vi` is already imported in Step 2, so no new import is needed, and
`vi.mock` is hoisted automatically just like `jest.mock`:

```ts
// before
const push = jest.fn();
jest.mock('stencil-router-v2', () => ({
  createRouter: () => ({ onChange: jest.fn(), push }),
}));
// ...
const onRouteChange = jest.fn();

// after
const push = vi.fn();
vi.mock('stencil-router-v2', () => ({
  createRouter: () => ({ onChange: vi.fn(), push }),
}));
// ...
const onRouteChange = vi.fn();
```

Replace **every** occurrence — both the module-level mock factory (`jest.mock` → `vi.mock`) and any inline
`jest.fn()` calls inside the tests.

### Step 3: Replace `newSpecPage` rendering with `render`

Replace each Stencil `newSpecPage({ components: [...], html: '...' })` call with the Vitest `render` helper using JSX:

```ts
const page = await render(<my-component></my-component>);
```

This removes the need for the `components` array and HTML string. The `newSpecPage` import (and any now-unused
component imports) may become unused — the user may instruct removal next.

**`page.setContent(...)` is NOT covered by a mechanical conversion.** If the test calls `newSpecPage` *without* an
`html` option and then uses `page.setContent(...)` to render the component, STOP and ask the user. `setContent` is
used to defer component rendering so listeners can be attached before lifecycle hooks fire.

When the listener must be in place before `componentWillLoad` runs (e.g. to catch a `pod-os:resource` subscription
event), the idiomatic Vitest conversion is: attach the listener to `document` *before* calling `render`, then render
normally — `render`'s `componentWillLoad` fires synchronously and the document-level listener catches the event.
Note that `page` may then be unused if the test only asserts on the listener; drop the `const page =` binding in that
case. But confirm this approach with the user first — do not improvise.

### Step 3b: Handle tests that used `supportsShadowDom: false`

Some Jest specs force **light DOM** by passing `supportsShadowDom: false` to `newSpecPage`. The `@stencil/vitest`
`render` helper has no such option — it renders the component with whatever shadow mode its `@Component` decorator
declares (usually shadow DOM). After converting with `render` (Step 3), such tests will be **red** because the
rendered markup now lives inside a shadow root instead of as light-DOM children of the host element.

Use normal render with shadow DOM in vitest. Then, for each affected  assertion:

1. **Assert on the shadow root, not the host element.** Change `expect(page.root).toEqualHtml(...)` to
   `expect(page.root.shadowRoot).toEqualHtml(...)`. Drop the host-element wrapper lines (e.g. `<pos-select-term>` and
   its closing `</pos-select-term>`) from the expected HTML — `shadowRoot` only contains the shadow content.
2. **Route `querySelector` through the shadow root.** Light-DOM lookups like `page.root.querySelector('input')` now
   return `null` because the element is in the shadow root. Change them to `page.root.shadowRoot!.querySelector(...)`.
   The `!` will be demanded by `tsc` in Step 7 — add it here so the test runs.
3. **Re-derive the expected HTML from the actual test output.** Do NOT reuse the old light-DOM `toEqualHtml` string
   verbatim — shadow-root serialization differs from light-DOM serialization in ways that are not obvious. Run the
   test, read the `Received:` block, and match it exactly. Two diffs observed so far:
   - An empty input that serialized as `value=""` in light DOM drops the `value` attribute entirely under shadow DOM.
   - Inline element text content like `<option value="...">schema:name</option>` must be reformatted to multiline
     (`<option value="...">\n  schema:name\n</option>`) to match the shadow-root pretty-printer — the inline form
     fails even though the normalised diff looks identical to the received output.

This is the established repo pattern: other migrated `.vspec.tsx` files assert on `page.root.shadowRoot` directly.


### Step 4: Replace the component import with a side-effect import

Replace the named component import (e.g. `import { PosReverseRelations } from './pos-reverse-relations';`) with a
side-effect import. **Preserve the original relative path exactly** — the original specifier includes whatever
directory prefix it had. Do not rewrite `'../foo'` as `'./foo'`. Only the import form changes, not the path:

```ts
// before
import { PosReverseRelations } from './pos-reverse-relations';
// after
import './pos-reverse-relations';

// before (test in a test/ subdirectory)
import { PosSelectTerm } from '../pos-select-term';
// after
import '../pos-select-term';
```

Since `render` no longer needs the `components` array, the named import is no longer needed.


### Step 5: Simplify empty-rendering assertions

For tests that assert an initially-empty component, replace the verbose `toEqualHtml` block:

```ts
expect(page.root).toEqualHtml(`
  <pos-reverse-relations>
    <mock:shadow-root></mock:shadow-root>
  </pos-reverse-relations>
`);
```

with the simpler matcher:

```ts
expect(page.root).toBeEmptyDOMElement();
```


### Step 6: Rename `page.rootInstance` to `page.instance`

In Stencil's `newSpecPage` API the component instance is accessed via `page.rootInstance`. The `@stencil/vitest` `render`
helper exposes it directly as `page.instance` instead. Replace all occurrences:

```ts
// before
await page.rootInstance.receiveResource({ ... });
// after
await page.instance.receiveResource({ ... });
```


### Step 7: Add non-null assertions (`!`) to `shadowRoot` — guided by `tsc`

In tests we assume `shadowRoot` exists. `querySelector(...)` calls on it return `Element | null`, but when the result is only
passed to `expect(...)` the compiler accepts `null` fine, so **do not blanket-add `!` everywhere**. Instead, add the
minimal set of non-null assertions the compiler actually requires:

1. Remove all non-null assertions (start clean).
2. Run `tsc` and collect `TS18047: '...' is possibly 'null'` errors:

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep 'path/to/file.vspec'
```

3. Add `!` only where `tsc` complains (typically directly on `page.root.shadowRoot!` for inline
   `.querySelector(...)` calls). Lines that alias the result via `as unknown as HTMLElement` need no `!`.
4. Re-run `tsc` to confirm 0 errors.


### Step 8: Format with Prettier

Run Prettier on the migrated file to clean up any reformatting introduced by the edits above (e.g. long `querySelector`
lines wrapping onto multiple lines):

```bash
npx prettier --write path/to/file.vspec.tsx
```


### Step 9: Remove unused imports reported by `tsc`

The migration above leaves several imports unused (e.g. `newSpecPage`, `getByText`, and possibly `vi` / `beforeEach` /
`afterEach` if those Vitest globals aren't used in this particular test). The project's `tsconfig.json` already has
`noUnusedLocals: true`, so `tsc` will flag them:

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep 'path/to/file.vspec'
```

Remove every import the compiler reports as `TS6133: '...' is declared but its value is never read.` Keep only the
imports the test actually uses (typically `describe, expect, it, render, h` from `@stencil/vitest`, plus `vi` if the
test mocks anything, plus the side-effect component import from Step 4).

