---
name: podos-dev-browser
description: Open and inspect the running PodOS dev app with playwright-cli, including signing in. Use when the user asks to visit, open, test, or inspect the PodOS Browser app, sign in to the dev server, or check how a page renders.
---

# PodOS Dev Browser Access

## Stack

- PodOS Browser app: http://localhost:3333 (dev standalone)
- Community Solid Server: http://localhost:3000 (see `dev-solid-server/Readme.md`)

## Dev accounts (do NOT guess credentials)

| E-Mail            | Password | WebID |
| ----------------- | -------- | ----- |
| alice@pod-os.test | alice    | http://localhost:3000/alice/profile/card#me |
| bob@pod-os.test   | bob      | http://localhost:3000/bob/profile/card#me |

## Sign in via playwright-cli

```bash
npx playwright cli open http://localhost:3333
npx playwright cli click "getByRole('button', { name: 'Sign in' })"
npx playwright cli fill "getByRole('combobox', { name: /Identity Provider/ })" "http://localhost:3000/" --submit
npx playwright cli fill "getByRole('textbox', { name: 'Email' })" "alice@pod-os.test"
npx playwright cli fill "getByRole('textbox', { name: 'Password' })" "alice"
npx playwright cli click "getByRole('button', { name: 'Log in' })"
# consent screen: authorize (css selector; button name may vary)
npx playwright cli click "getByRole('button', { name: 'Authorize' })"
```

After authorizing, the browser lands back on localhost:3333 logged in, showing the
user menu (Dashboard / Settings / Logout) and the pod's public/private things.

Note: the Login button is disabled until the input's state update lands, so `fill ... --submit`
can press Enter while the button is still disabled. If nothing happens after Enter,
click the Login button inside the dialog explicitly.

## Inspecting

Use the playwright-cli skill's snapshot/find/console commands as usual.
