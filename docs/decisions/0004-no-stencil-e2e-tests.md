# Do not use Stencil E2E Tests

## Context and Problem Statement

PodOS elements are build with [Stencil](https://stenciljs.com). The official
documentation differs between Unit Testing and End-to-end (E2E) Testing Stencil
components.

E2E turned out to be slow, very hard to debug and did not run with
[IntelliJ idea](https://www.jetbrains.com/de-de/idea/) or
[Wallaby](wallabyjs.com/).

## Decision Outcome

Currently, it is enough to write unit tests and integration tests. For
integration tests, we use the same mechanism as for unit tests, but render more
than one component in one spec page, to ensure they work well together.

Naming conventions:

 - *.spec.tsx for unit tests
 - *.integration.spec.tsx for integration tests

PodOS core is mocked in both cases. Real End-to-End tests including PodOS core
could be based on e.g. Cypress as soon as needed.

Existing Stencil E2E Tests are replaced with integration tests.
