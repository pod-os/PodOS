# Task 3 — End-to-end integration test

> **Status:** Open
> **Depends on:** Task 1, Task 2

## Goal

Confirm the full round-trip works end-to-end: fetch a binary resource, verify metadata triples appear, write a new triple, verify it persists in the `.meta` document.

## Scope

- One integration test using Community Solid Server (which already serves `.meta` documents and `rel="describedby"` headers)
- Test steps:
  1. PUT a binary resource (e.g. `test.pdf`) and its `.meta` document to CSS
  2. Call `Store.fetch(binaryUri)` — verify metadata triples are loaded
  3. Call `store.addPropertyValue()` on the binary `Thing` — verify write succeeds
  4. Re-fetch or re-read the store — verify the new triple is present
  5. Optionally: verify the `.meta` document on the server contains the new triple

## Verification

- Test passes green in CI

## Out of Scope

- Element-level testing (Task 4)
- Servers that don't support auxiliary resources
