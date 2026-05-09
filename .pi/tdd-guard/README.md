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
| Tests failing (red) | ❌ Blocked — go green first | ✅ Allowed — this is the green step |

### Git write commands are always blocked in bash

The agent may never run `git commit`, `git add`, `git push`, `git stash`, `git reset`, `git checkout`, `git merge`, `git rebase`, `git tag`, `git rm`, or `git mv`.

Committing is the **human's job**. The agent proposes a commit message after each cycle and waits. The guard blocks any attempt to bypass this via the `bash` tool.

## Setup

The reporter is already wired into `elements/jest.config.js`.

For other packages in this repo, add to their `jest.config.js`:

```js
reporters: [
  'default',
  ['<rootDir>/../.pi/tdd-guard/jest-reporter.js', {}],
],
```

If the package is more than one level below the workspace root, adjust the path
to `jest-reporter.js` and pass `projectRoot` explicitly:

```js
['path/to/jest-reporter.js', { projectRoot: '/absolute/path/to/workspace' }]
```

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
