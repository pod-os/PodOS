---
name: migrate-jest-to-vitest
description: Migrate a stencil component unit test (spec.tsx) from Jest to Vitest.
---

Execute steps mechanically. Do only what the current step says — do not read ahead, combine steps, or reason
about the broader file. If anything unexpected comes up, STOP and ask the user.

After the user gives corrective feedback, update this skill to document the lesson learned.

## Steps

### Step 1: Rename the test file

`git mv path/to/file.spec.tsx path/to/file.vspec.tsx`

### Step 2: Replace the component import with a side-effect import

Drop the named export, keep the path exactly: `import './pos-reverse-relations';`

### Step 3: Add the Vitest imports

At the top of the file, before the existing imports:

```ts
import { vi } from 'vitest';
import { beforeEach, afterEach, describe, expect, it, render, h } from '@stencil/vitest';
```

### Step 4: Switch `mockPodOS` to the vitest variant

`import { mockPodOS } from '../../../test/mockPodOS.vitest';`

### Step 5: Replace `jest.*` with `vi.*`

Global find-and-replace `jest.` → `vi.` throughout the file.

### Step 6: Replace `jest-when` with `vitest-when`

Swap the import, then update the API: `.mockReturnValue` → `.thenReturn`, `.mockResolvedValue` → `.thenResolve`,
`.mockRejectedValue` → `.thenReject`. The `when(fn).calledWith(...)` prefix is unchanged.

**Chained `.mockReturnValueOnce`:** use separate `when` registrations with `{ times: 1 }`:

```ts
when(fn, { times: 1 }).calledWith(arg).thenReturn(first);
when(fn, { times: 1 }).calledWith(arg).thenReturn(second);
```

⚠️ **LIFO ordering:** later registrations match first. Declare the first `when` before the consuming call,
register the second `when` after the first call has been consumed.

**Bare catch-all defaults** (`when(fn).mockReturnValue(v)`, no `.calledWith`) are not supported. Drop if the
mock factory already sets a default; otherwise cast: `(fn as Mock).mockReturnValue(v)` and add `Mock` to the
`vitest` import.

### Step 7: Replace `newSpecPage` with `render`

```ts
const page = await render(<my-component></my-component>);
```

⚠️ If the test uses `page.setContent(...)`, STOP and ask the user.

### Step 8: Rename `page.rootInstance` → `page.instance`

### Step 9: Remove unused imports — guided by `tsc`

```bash
npx tsc --noEmit -p elements/tsconfig.json 2>&1 | grep 'path/to/file.vspec'
```

⚠️ Always specify the package tsconfig — there is no root `tsconfig.json`, and a missing `-p` flag fails
silently when piped to `grep`.

Remove every `TS6133` import.

### Step 10: Add non-null assertions — guided by `tsc`

Run the same `tsc` command; add `!` only where `TS18047` is reported. Re-run to confirm 0 errors.

### Step 11: Format with Prettier

`npx prettier --write path/to/file.vspec.tsx`

---

## Situational

### Shadow DOM: `supportsShadowDom: false` tests

`render` always uses the component's declared shadow mode. Affected tests are red after Step 7:

1. Assert on `page.root.shadowRoot` instead of `page.root`; drop host-element wrapper lines from expected HTML.
2. Route `querySelector` through `page.root.shadowRoot!`.
3. Re-derive expected HTML from the `Received:` block — do not reuse the light-DOM string. Known diffs:
   - `value=""` on empty inputs is dropped under shadow DOM.
   - Inline text content must be multiline (see below).

### Shadow DOM: reformat inline-text `toEqualHtml` to multiline

The shadow-root pretty-printer requires multiline format for elements with text — the inline form fails even
when Expected and Received look identical. Read the `Received:` block and match it verbatim:

```ts
expect(el).toEqualHtml(`
  <li>
    SomeType
  </li>
`);
```

### `RenderResult` type for helper functions

Change `SpecPage` parameter types to `RenderResult` (from `@stencil/vitest`). Drop `@stencil/core/testing`.

### Stub value-used exports in `vi.mock('@pod-os/core', ...)`

`vi.mock('@pod-os/core', () => ({}))` fails at runtime if the component references a core symbol as a value —
Vitest's Proxy throws on missing exports. Add a stub for each value-used symbol:

```ts
vi.mock('@pod-os/core', () => ({ RdfDocument: class {} }));
```

Type-only usages are erased at runtime and need no stub. `tsc` will not catch this — only the runtime does.

### Stub read-only host objects with `vi.spyOn`

Assigning to getter-only properties (e.g. `navigator.clipboard`) throws. Use `vi.spyOn(navigator.clipboard, 'writeText')` instead. If the property is absent in the environment, fall back to `Object.defineProperty`.

### Simplify empty-rendering assertions

```ts
expect(page.root).toBeEmptyDOMElement();
```

### `toEqualText` expects an element, not a string

`@stencil/vitest`'s `toEqualText` calls `getTextContentWithShadow(received)`, which iterates
`received.childNodes`. Passing a **string** (e.g. `expect(el.innerText).toEqualText('x')`) throws
`TypeError: undefined is not iterable`. Jest's version coerced strings; Vitest's does not. Pass the element:

```ts
expect(el).toEqualText('x');
```

### `.vspec.tsx` is newly type-checked

`elements/tsconfig.json` excludes `**/*.spec.tsx` but **not** `**/*.vspec.tsx`, so renaming subjects the
file to `tsc` for the first time. Pre-existing loose mock data surfaces as `TS2322`/`TS2739` (object
literals missing required fields, wrong field names). Cast the mock data — precedented across the codebase
(`pos-attachments`, `pos-container-contents`):

```ts
const tools = [{ label: 'Tool 1', component: 'pos-test-tool-1' }] as unknown as ToolConfig[];
```

Import the type from its source module. These appear during Steps 9–10 but are **not** `TS6133`/`TS18047` —
they need this cast, not import removal.

### `@testing-library/dom` queries don't pierce shadow DOM

`queryAllByRole(el, 'tab')` and siblings operate on `el`'s light-DOM subtree only. For a `shadow: true`
component, use the project helper `withinShadow` (in `elements/src/test/withinShadow.ts`), which wraps
`@testing-library/dom`'s `within()` around `page.root.shadowRoot`. Precedented across `pos-login-form`,
`pos-container-toolbar`, `pos-new-thing-form`:

```ts
import { withinShadow } from '<rel>/test/withinShadow';
// ...
const buttons = withinShadow(page).getAllByRole('tab');
```

The import path is relative to the test file's directory (`../../test/withinShadow`, `../../../test/withinShadow`, …).

Note: `queryAllByRole` returns `[]` when nothing matches; `getAllByRole` **throws**. Use `queryAllByRole`
when asserting absence.

### `page.win` → `window`

`SpecPage` exposes a `win` (mocked window); `RenderResult` does not. Replace window-scoped listeners with
the global:

```ts
window.addEventListener('pod-os:tool-selected', spy);
```
