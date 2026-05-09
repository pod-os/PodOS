---
name: tdd
description: Implements features using Test-Driven Development (TDD). Use when asked to implement a feature (TDD is a must).
---

# TDD Skill

Follow the **red → green → refactor** cycle strictly, **one cycle at a time**.

## Cycle

### 1. Red — write ONE failing test
- Pick the **single next** unimplemented behaviour from the plan.
- Write **one** test that captures it.
- Run the **full** test suite with no filters: `npx jest --no-coverage` (no `--testPathPatterns` or any other filter).
  - The new test must fail.
  - It must fail **for the expected reason** (missing feature — not a compile error).
  - No previously passing test may newly break.
- **Stop. Show the output. The guard now blocks impl writes until tests are run.**

### 2. Green — make it pass with minimal code
- Write the simplest production code that makes the failing test pass.
  *(The guard allows this because tests are failing.)*
- Run the **full** test suite with no filters: `npx jest --no-coverage`.
- If the implementation change causes regressions in *other* test files, fix those tests immediately — this is still part of the green step, not a new red step.
- Confirm every test passes before stopping.
- **Stop. Show the output. The guard now blocks further impl writes.**

### 3. Refactor — clean up
- Improve structure, naming, or remove duplication — without changing behaviour.
- Run the full test suite again to confirm all tests still pass.
- **Stop. Show the output.**

## Hard rules

- **One test per red step.** Writing multiple tests at once is a violation. If you catch yourself adding more than one new test, stop and delete the extras.
- **No implementation before red.** Writing production code before a failing test exists is a violation.
- **No future-proofing.** Only write code a currently-failing test demands.
- **Always run tests** after every step and include the output before continuing.
- **Confirm the failure reason.** A red test must fail because the feature is missing — not because of a syntax error or an already-failing unrelated test.

## Completing a cycle

After the refactor step:
1. State which behaviour was just implemented.
2. Show the full passing test output.
3. Propose a commit message: `test: <behaviour>` for the test file and `feat: <behaviour>` for the implementation (or a single combined message).
4. **Stop. Do not run `git commit` or any git write command. Committing is the human's job.**
5. **Wait for explicit human approval before starting the next cycle.**

Only proceed to the next red step once the human says so. The guard enforces this: it blocks the next red step until the working tree is clean (i.e. the human has committed).

## Absolute prohibitions

- **Never run `git commit`, `git add`, `git push`, or any git write command.** These are reserved for the human. The guard will block you if you try.
- **Never run `git stash`, `git reset`, or `git checkout` to manipulate history.** If the working tree is dirty and the guard is blocking, stop and tell the human — do not work around it.
