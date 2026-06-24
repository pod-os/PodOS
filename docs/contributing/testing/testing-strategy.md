# PodOS testing strategy

## Testing framework

We are using vitest as a testing framework. Jest is deprecated and will be phased out. Until this is complete vitest test files need to include the part `*.vspec.*` instead of `*.spec.*` to keep them apart.

## PodOS core

### Unit tests

Unit tests only test a single class or function, everything else is mocked.

Naming convention: `*.vspec.ts`

### Integration tests

Test the integration with other components. May use a real rdflib store and verify against its contents. Network
requests are mocked by mocking the `fetch` function.

Naming convention: `*.integration.vspec.ts`

## PodOS elements

## Unit Tests

Unit tests only test a single component, everything else is mocked. The component under test needs to be imported
explicitly:

```ts
import './pos-label';
```

Unit tests are configured to use the [Stencil Vitest Plugin](https://github.com/stenciljs/vitest#stencil-vitest-plugin),
so that changes compile on the fly and dependencies can be mocked.

Unit tests that target plain functions / classes and do not need a DOM can be run with plain node.

Naming conventions:
- `*.vspec.tsx` for component unit test, using a dom environment 
- `*.vspec.ts` for unit tests, that only need a node environment 

## Integration Tests

Integration tests verify a component in integration with other components, e.g. a real `pos-app` / `pos-resource`
arround it.

The tests run against a compiled bundle, so after every change to the production code, a build has to be done. All
custom elements provided by the bundle can be used in the test without any imports. The bundle also includes PodOS core,
so the tests are very close to the real behaviour.

Network requests are mocked using a mock service worker provided by [msw](https://mswjs.io).

Naming convention: `*.integration.vspec.tsx`

## End-to-end tests (E2E)

Stencil allows for E2E tests using a real browser and playwright. We are currently only implementing [E2E tests on the
application level](../../../apps/tests), not for individual components. This might change in the future.

