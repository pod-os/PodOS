# TDD Guard

Deterministic red→green→refactor enforcement for pi.

## How it works

```
  you run tests
       │
       ▼
  jest-reporter.js  ──writes──►  .pi/tdd-guard/test-results.json
                                          │
                                          │ read on every tool call
                                          ▼
                                 tdd-guard.ts extension
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │                                               │
           writing test file?                        writing impl file?
                  │                                               │
        tests already failing?                     no failing tests?
                  │                                               │
               BLOCK ◄─────────────────────────────────────── BLOCK
          "complete green                                  "write a failing
           step first"                                      test first"
```

The agent physically cannot call `write` or `edit` without this check running first.

## Rules enforced

| Situation | Writing a test file | Writing an impl file |
|---|---|---|
| All tests passing (green) | ✅ Allowed — this is the red step | ❌ Blocked — no failing test to satisfy |
| Tests failing (red) | ❌ Blocked — go green first (see exception below) | ✅ Allowed — this is the green step |

### Exception: regression repair during the green step

When an implementation change (green step) causes regressions in *other* test files that were previously passing, those test files need to be updated as part of completing the green step — not as a new red step.

The guard detects this by checking git status: if the test file being edited is **already dirty** (modified during this green step), the edit is treated as a regression repair and allowed. If the test file is clean (not yet touched this cycle), the edit is a new red step and blocked until tests pass.

### Git write commands are always blocked in bash

The agent may never run `git commit`, `git add`, `git push`, `git stash`, `git reset`, `git checkout`, `git merge`, `git rebase`, `git tag`, `git rm`, or `git mv`.

Committing is the **human's job**. The agent proposes a commit message after each cycle and waits. The guard blocks any attempt to bypass this via the `bash` tool.

## Setup

The reporter is wired into the **root `jest.config.js`** via the top-level
`reporters` field. Because all sub-packages run as Jest `projects` from the
root, a single reporter entry covers everything — no changes are needed in the
individual package configs (`core/`, `elements/`, `contacts/`, etc.).

```js
// jest.config.js (workspace root)
export default async () => ({
  reporters: [
    'default',
    ['<rootDir>/.pi/tdd-guard/jest-reporter.js', {}],
  ],
  projects: [
    // ... sub-package configs
  ],
});
```

Always run tests from the **workspace root** (`npm test`) so the reporter is
picked up and `test-results.json` stays current.


## Files

| File | Purpose |
|---|---|
| `jest-reporter.js` | Jest reporter — writes `test-results.json` after every run |
| `test-results.json` | Live test state (gitignored) |
| `README.md` | This file |

The extension that does the blocking lives at `.pi/extensions/tdd-guard.ts`.

## Gitignore

Add to `.gitignore`:

```
.pi/tdd-guard/test-results.json
```
