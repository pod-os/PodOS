# Plan: "Remember Me" for the IdP in `pos-login`

## Overview

When a user submits the login form, their chosen IdP URL is saved to the existing `localSettings` store (`src/store/settings.ts`). On the next visit, `pos-login-form` reads that value back and **pre-fills** the IdP input, so the user only has to click **Login** instead of re-typing the URL. A **"Remember me"** checkbox gives them explicit control over whether the IdP is persisted.

---

## Why reuse `settings.ts` instead of raw `localStorage`

`settings.ts` already uses `@stencil/store` backed by `localStorage`. Extending it gives us:

- **Automatic persistence** — the `on('set')` handler in `persistChanges()` writes the whole settings object to `localStorage` on every state change, no manual `setItem` / `removeItem` needed.
- **Cross-tab sync** — the `storage` event listener in `syncChangesAcrossTabs()` propagates changes to other open tabs for free.
- **Single source of truth** — all persisted user preferences live in one place (`localStorage` key `"settings"`), rather than a second isolated key.

---

## Affected files

| File | Change |
|---|---|
| `src/store/settings.ts` | Add `rememberedIdp: string \| null` to `LocalSettings`; initialise it to `null`; sync it in `syncChangesAcrossTabs` |
| `pos-login-form/pos-login-form.tsx` | Import `localSettings`; add `rememberMe` state; `componentWillLoad` pre-fill; read/write store in `handleSubmit`; checkbox in render |
| `pos-login-form/pos-login-form.css` | Style the new checkbox row |
| `pos-login-form/test/pos-login-form.spec.tsx` | Reset store in `beforeEach`; snapshot update; new behaviour tests |
| `pos-login/pos-login.integration.spec.tsx` | Integration test: remembered IdP is pre-filled on next open |

---

## `settings.ts` — detailed changes

### 1. Extend the interface
```ts
export interface LocalSettings {
  offlineCache: boolean;
  rememberedIdp: string | null;
}
```

### 2. Add to the default initial state
```ts
const initialSettings = storedSettings
  ? JSON.parse(storedSettings)
  : {
      offlineCache: false,
      rememberedIdp: null,
    };
```

### 3. Sync in `syncChangesAcrossTabs`
```ts
localSettings.state.offlineCache = newSettings.offlineCache;
localSettings.state.rememberedIdp = newSettings.rememberedIdp ?? null;
```

---

## `pos-login-form.tsx` — detailed changes

### 1. Import the store
```ts
import { localSettings } from '../../store/settings';
```

### 2. New `@State() rememberMe: boolean = false`
Tracks whether the checkbox is checked.

### 3. Read from the store on component init (`componentWillLoad`)
```ts
componentWillLoad() {
  const remembered = localSettings.state.rememberedIdp;
  if (remembered) {
    this.idpUrl = remembered;
    this.rememberMe = true;   // checkbox pre-checked when a value exists
    this.canSubmit = true;
  }
}
```

### 4. Update `handleSubmit`
```ts
async handleSubmit() {
  localSettings.state.rememberedIdp = this.rememberMe ? this.idpUrl : null;
  this.idpUrlSelected.emit(this.idpUrl);
}
```

### 5. Render — add checkbox below the datalist, above the submit button
```tsx
<label class="remember-me">
  <input
    id="rememberMe"
    type="checkbox"
    checked={this.rememberMe}
    onChange={e => (this.rememberMe = (e.target as HTMLInputElement).checked)}
  />
  Remember me
</label>
```

The submit button and form structure stay unchanged.

---

## `pos-login-form.css` — styling

Add a rule for the `.remember-me` label so the checkbox and text sit inline, consistent with the existing form layout:
```css
label.remember-me {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  cursor: pointer;
}

label.remember-me input[type='checkbox'] {
  width: auto;       /* override the full-width rule on `input` */
  accent-color: var(--pos-primary-color);
}
```

---

## Unit tests — `pos-login-form.spec.tsx`

### Setup
Add a `beforeEach` that resets the store, so tests are isolated:
```ts
beforeEach(() => {
  localSettings.state.rememberedIdp = null;
});
```

### Snapshot update
The existing full-render snapshot test needs the new checkbox row added between the `<datalist>` and the submit `<input>`:
```html
<label class="remember-me">
  <input id="rememberMe" type="checkbox">
  Remember me
</label>
```

### New test cases

| Test | What it covers |
|---|---|
| **renders "Remember me" checkbox unchecked by default** | `checkbox.checked === false` when store is empty |
| **pre-fills IdP URL and checks box when a value is in settings** | Set `localSettings.state.rememberedIdp` before mount → input `value` and checkbox `checked`; submit button already enabled |
| **saves IdP URL to settings on submit when "Remember me" is checked** | Enter URL, check box, submit → `localSettings.state.rememberedIdp` equals the entered URL |
| **clears IdP URL from settings on submit when "Remember me" is unchecked** | Pre-seed store, uncheck, submit → `localSettings.state.rememberedIdp` is `null` |
| **still emits pod-os:idp-url-selected even when "Remember me" is unchecked** | Guards against regression |

---

## Integration test — `pos-login.integration.spec.tsx`

Add one scenario after the existing "allows Alice to log in" test:

> **"pre-fills the IdP URL when one has been remembered"**
> 1. Seed `localSettings.state.rememberedIdp` with a remembered IdP URL.
> 2. Mount the page.
> 3. Open the login dialog.
> 4. Assert the `pos-login-form` input already has the remembered URL as its value.
> 5. Assert the submit button is already enabled (no typing required).

---

## What is intentionally NOT in scope

- **No auto-login / silent login** on page load — the user must still click "Login" and confirm. This keeps the behaviour predictable and avoids surprising redirects.
- **No separate "forget me" button** — unchecking the box and logging in again is the natural flow for opting out.
- **No migration of the old `rememberedIdp` localStorage key** — the key never shipped, so there is nothing to migrate.
