---
name: migrate-jest-to-vitest
description: Migrate a stencile component unit test (spec.tsx) from Jest to Vitest.
---

The user will instruct you exactly what to do. Do only that, then document that into this skill. Do not try to solve
problems on your own. Follow the described path and delegate anything that comes unexpected to the user.

## IMPORTANT: Self-improve after EVERY instruction (not just at the end)

After you apply each instruction the user gives you to the test file, you MUST immediately update this skill file to
document what you just did as a new numbered step. Do this BEFORE awaiting the next instruction. Do not defer it. Do
not wait for the user to say "self-improve" or "IMPORTANT: Self-Improvement". The documentation step is part of the
task, not an afterthought.

If you skip this, you are not done with the instruction.

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

Then self-improve and await the user's next instruction.

### Step 3: Replace `newSpecPage` rendering with `render`

Replace each Stencil `newSpecPage({ components: [...], html: '...' })` call with the Vitest `render` helper using JSX:

```ts
const page = await render(<my-component></my-component>);
```

This removes the need for the `components` array and HTML string. The `newSpecPage` import (and any now-unused
component imports) may become unused — the user may instruct removal next.

Then self-improve and await the user's next instruction.

### Step 4: Replace the component import with a side-effect import

Replace the named component import (e.g. `import { PosReverseRelations } from './pos-reverse-relations';`) with a
side-effect import:

```ts
import './pos-reverse-relations';
```

Since `render` no longer needs the `components` array, the named import is no longer needed.

Then self-improve and await the user's next instruction.

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

Then self-improve and await the user's next instruction.

### Step 6: Rename `page.rootInstance` to `page.instance`

In Stencil's `newSpecPage` API the component instance is accessed via `page.rootInstance`. The `@stencil/vitest` `render`
helper exposes it directly as `page.instance` instead. Replace all occurrences:

```ts
// before
await page.rootInstance.receiveResource({ ... });
// after
await page.instance.receiveResource({ ... });
```

Then self-improve and await the user's next instruction.

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

Then self-improve and await the user's next instruction.

### Step 8: Format with Prettier

Run Prettier on the migrated file to clean up any reformatting introduced by the edits above (e.g. long `querySelector`
lines wrapping onto multiple lines):

```bash
npx prettier --write path/to/file.vspec.tsx
```

Then self-improve and await the user's next instruction.

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

Then self-improve and await the user's next instruction.
