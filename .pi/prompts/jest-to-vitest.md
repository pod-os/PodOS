---
description: Migrate one Jest spec file to Vitest (@stencil/vitest)
argument-hint: "<path/to/component.spec.tsx>"
---
Migrate the Jest spec file `$1` to a Vitest spec file following the established pattern in this project.

## Migration rules

### File naming
- Source file: `$1` (the `.spec.tsx` Jest file)
- Output file: same directory, same base name, extension `.vspec.tsx`

### Import changes
- Remove: `import { newSpecPage } from '@stencil/core/testing';`
- Add: `import { render, h, describe, it, expect } from '@stencil/vitest';`
- Remove the component class import (e.g. `import { PosLabel } from './pos-label';`) — it is no longer needed
- Keep all other imports (e.g. `rxjs`)

### Test body changes
- Replace `newSpecPage({ components: [...], html: `<pos-xyz />` })` with `await render(<pos-xyz></pos-xyz>)`
- `render` returns `{ root, waitForChanges }` — destructure what you need
- Remove `page.rootInstance.receiveResource(resource)` / any direct instance manipulation.
  Instead wire up resources via a DOM event listener on `document` for `'pod-os:resource'`:
  ```ts
  document.addEventListener('pod-os:resource', (event: any) => {
    event.detail(resource);
  });
  ```
  Extract this into a local helper function at the end of the file (e.g. `mockReceiveResourceWithLabel()`) so tests stay short.
- Replace `page.waitForChanges()` with `waitForChanges()` from the `render` return value
- Replace `page.root` snapshot assertions that include the full element wrapper with `root.shadowRoot` assertions when the test is about shadow content:
  - Full element check: `expect(root).toEqualHtml(...)` — include `class="hydrated"` on the root tag in the expected HTML
  - Shadow content only: `expect(root.shadowRoot).toEqualHtml(...)` — only the inner content, no wrapper tag

### General approach
- **Migrate one test (`it(...)` block) at a time.**
- After each test is migrated, run the new `.vspec.tsx` file with vitest to verify it passes before moving on:
  ```
  cd elements && npx vitest run --reporter=verbose src/components/<component-dir>/<component>.vspec.tsx
  ```
- If a test fails or an unexpected error occurs **stop immediately** and explain the problem to the human before proceeding. Do not attempt to fix the problem autonomously — consult first.
- Only continue to the next test once the current one is green.

### Do not
- Do not modify the original `.spec.tsx` Jest file
- Do not run the full test suite — only the single `.vspec.tsx` file being migrated
- Do not guess at fixes for failures — stop and ask

## Start
Read `$1`, then create the `.vspec.tsx` file and migrate the tests one by one as described above.
