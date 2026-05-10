# TDD Guard

Deterministic test→impl→refactor enforcement for pi.

## How it works

```
  Wallaby runs tests continuously
       │
       ▼
  tdd-guard.ts extension
       │
       ├── on activation: queries Wallaby MCP for live results
       │
       ├── writes results to test-results.json
       │
       └── on every tool call: reads test-results.json
                  │
    ┌─────────────┴─────────────┐
    │                           │
 writing test file?    writing impl file?
    │                           │
 tests already failing?  no failing tests?
    │                           │
 BLOCK ◄──────────────────── BLOCK
 "complete impl             "write a failing
  step first"                test first"
```

The agent physically cannot call `write` or `edit` without this check running first.

## Wallaby Integration

The guard uses **Wallaby MCP** for live test results.

- Phase activation (`/tdd-activate` or `activate_tdd_phase`) queries Wallaby directly
- No waiting for a full test suite run — results are instant
- Wallaby must be running in your editor

The agent should use Wallaby tools (`wallaby_failingTests`, `wallaby_allTests`)
after every change to verify test results before proceeding.

## Rules enforced

| Situation | Writing a test file | Writing an impl file |
|---|---|---|
| All tests passing | ✅ Allowed — this is the test step | ❌ Blocked — no failing test to satisfy |
| Tests failing | ❌ Blocked — complete impl step first (see exception below) | ✅ Allowed — this is the impl step |

### Exception: regression repair during the impl step

When an implementation change (impl step) causes regressions in *other* test files that were previously passing, those test files need to be updated as part of completing the impl step — not as a new test step.

The guard detects this by checking git status: if the test file being edited is **already dirty** (modified during this impl step), the edit is treated as a regression repair and allowed. If the test file is clean (not yet touched this cycle), the edit is a new test step and blocked until tests pass.

### Git write commands are always blocked in bash

The agent may never run `git commit`, `git add`, `git push`, `git stash`, `git reset`, `git checkout`, `git merge`, `git rebase`, `git tag`, `git rm`, or `git mv`.

Committing is the **human's job**. The agent proposes a commit message after each cycle and waits. The guard blocks any attempt to bypass this via the `bash` tool.

## Setup

1. Ensure Wallaby is running in your editor.
2. The `wallaby-mcp` extension must be loaded at `.pi/extensions/wallaby-mcp/`.

No Jest reporter configuration is needed.

## Files

| File | Purpose |
|---|---|
| `test-results.json` | Live test state (gitignored) — written by the guard after querying Wallaby |
| `config.json` | Current phase — `{ "phase": "test" \| "impl" \| "refactor" }`. Gitignored; auto-created at `test` on first session. |
| `README.md` | This file |

The extension that does the blocking lives at `.pi/extensions/tdd-guard.ts`.

## Gitignore

The directory ships its own `.pi/tdd-guard/.gitignore`:

```
test-results.json
config.json
```

Both files are runtime state. `config.json` is auto-created at `test` by the extension on first session start.
