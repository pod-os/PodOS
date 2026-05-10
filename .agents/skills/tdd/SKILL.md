---
name: tdd
description: Implements features using Test-Driven Development (TDD). Use when asked to implement a feature (TDD is a must).
---

# TDD Skill

## Prerequisite: Wallaby must be running

Before doing anything else, verify Wallaby is connected by calling `activate_tdd_phase` with phase `test`. If it returns a Wallaby connection error, **STOP IMMEDIATELY**. Do not attempt any workaround (e.g. writing files via `bash`, running `npm test` manually). Tell the user:

> 🛑 **Wallaby is not running.** Please start Wallaby in your editor, then tell me to continue.

This is a **showstopper** — the entire TDD workflow depends on Wallaby for live test results and the TDD guard depends on Wallaby to enforce phase transitions. Without it, nothing can proceed.

---

Follow the **red → green → refactor** cycle strictly, **one cycle at a time**.

## Cycle

### 1. Red — write ONE failing test
- Pick the **single next** unimplemented behaviour from the plan.
- Write **one** test that captures it.
- **Bootstrapping (no production module yet):** When the production module doesn't exist yet, you can't import it — the test would fail with a compile/module-not-found error instead of a proper assertion failure. To avoid this, **define a minimal stub directly in the test file** (e.g. a function that returns a dummy value). This keeps the test runnable and lets it fail for the right reason. The stub will be extracted to the production file during the refactor step.
- Check test results using Wallaby: call `wallaby_failingTests` to see which tests are failing, or `wallaby_allTests` for the full picture.
  - The new test must fail.
  - It must fail **for the expected reason** (missing feature — not a compile error).
  - No previously passing test may newly break.
- **Stop. Show the test results. The guard now blocks impl writes until tests are run.**

### 2. Green — make it pass with minimal code
- Write the simplest production code that makes the failing test pass.
  *(The guard allows this because tests are failing.)*
- After making your change, check Wallaby results using `wallaby_failingTests` to verify the test now passes.
- If the implementation change causes regressions in *other* test files, fix those tests immediately — this is still part of the green step, not a new red step.
- Confirm every test passes before stopping (use `wallaby_allTests` or `wallaby_failingTests` to verify).
- **Stop. Show the test results. The guard now blocks further impl writes.**

### 3. Refactor — clean up
- Improve structure, naming, or remove duplication — without changing behaviour.
- **Extract stubs:** If the red step used an inline stub (see bootstrapping above), extract it to the production file now and replace the stub with an import. The tests must stay green.
- After each refactoring change, check Wallaby results (`wallaby_failingTests`) to confirm all tests still pass.
- **Stop. Show the test results.**

## Hard rules

- **One test per red step.** Writing multiple tests at once is a violation. If you catch yourself adding more than one new test, stop and delete the extras.
- **No implementation before red.** Writing production code before a failing test exists is a violation.
- **No future-proofing.** Only write code a currently-failing test demands.
- **Always check test results** after every step using Wallaby tools (`wallaby_failingTests`, `wallaby_allTests`) and include the results before continuing. Wallaby provides instant, continuous test results — no need to run `npm test`.
- **Confirm the failure reason.** A red test must fail because the feature is missing — not because of a syntax error or an already-failing unrelated test. Use `wallaby_failingTests` to inspect the error details.

## Completing a cycle

After the refactor step:
1. State which behaviour was just implemented.
2. Show the full passing test results from Wallaby.
3. Propose a commit message: `test: <behaviour>` for the test file, `feat: <behaviour>` for the implementation, or `refactor: <description>` for refactoring-only changes (or a single combined message).
4. **Stop. Do not run `git commit` or any git write command. Committing is the human's job.**
5. **Wait for explicit human approval before starting the next cycle.**

Only proceed to the next red step once the human says so. The guard enforces this: it blocks the next red step until the working tree is clean (i.e. the human has committed).

## Absolute prohibitions

- **Never run `git commit`, `git add`, `git push`, or any git write command.** These are reserved for the human. The guard will block you if you try.
- **Never run `git stash`, `git reset`, or `git checkout` to manipulate history.** If the working tree is dirty and the guard is blocking, stop and tell the human — do not work around it.
- **Never bypass the TDD guard.** If Wallaby is not running or the guard blocks a write, do **not** use `bash` (e.g. `cat >`, `echo >`, `tee`, `cp`, `mv`, `sed -i`) to create or modify source/test files. The guard exists for a reason — circumventing it is a violation. Stop and tell the human what's blocking you.
