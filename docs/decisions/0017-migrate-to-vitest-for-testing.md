# Migrate to vitest for testing

## Context and Problem Statement

PodOS elements are built with [Stencil](https://stenciljs.com). The integrated Stencil Test Runner is deprecated as of
Stencil v4.43 and will be removed in Stencil v5. The recommended way of component testing is
[@stencil/vitest](https://stenciljs.com/docs/testing-vitest.

## Decision Outcome

We will migrate all PodOS tests to vitest. While PodOS core is not affected by the stencil change, it makes sense to
have a common testing framework for all packages.

The decisions about e2e tests stated in [0004-no-stencil-e2e-tests.md](0004-no-stencil-e2e-tests.md)
and [0006-end-to-end-testing-via-playwright.md](0006-end-to-end-testing-via-playwright.md) are uneffected for now.

### Positive Consequences

- vitest is faster than jest
- modern framework
- better alignment with the official stencil testing approach
- full dom / browser APIs in component tests

### Negative Consequences

- all tests need to be migrated