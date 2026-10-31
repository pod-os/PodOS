# PodOS testing strategy

## Testing framework

We are using vitest as a testing framework.

## PodOS core

### Unit tests

Unit tests only test a single class or function, everything else is mocked.

Naming convention: `*.spec.ts`

### Integration tests

Test the integration with other components. May use a real rdflib store and
verify against its contents. Network requests are mocked by mocking the `fetch`
function.

Naming convention: `*.integration.spec.ts`

## PodOS elements

## Unit Tests

Unit tests only test a single component, everything else is mocked. The
component under test needs to be imported explicitly:

```ts
import "./pos-label";
```

Unit tests are configured to use the
[Stencil Vitest Plugin](https://github.com/stenciljs/vitest#stencil-vitest-plugin),
so that changes compile on the fly and dependencies can be mocked.

Unit tests that target plain functions / classes and do not need a DOM can be
run with plain node.

Naming conventions:

- `*.spec.tsx` for component unit test, using a dom environment
- `*.spec.ts` for unit tests, that only need a node environment
- `*.dom.spec.ts` for unit tests don't render components, but still need a dom
  environment

## Integration Tests

Integration tests verify a component in integration with other components, e.g.
a real `pos-app` / `pos-resource` arround it.

The tests run against a compiled bundle, so after every change to the
production code, a build has to be done. The bundle embeds `@pod-os/core`, so
after changing core, rebuild core first, then elements. All custom elements
provided by the bundle can be used in the test without any imports. The bundle
also includes PodOS core, so the tests are very close to the real behaviour.

Network requests are mocked using a mock service worker provided by
[msw](https://mswjs.io).

Naming convention: `*.integration.spec.tsx`

## End-to-end tests (E2E)

Stencil allows for E2E tests using a real browser and playwright. We are
currently only implementing
[E2E tests on the application level](../../../apps/tests), not for individual
components. This might change in the future.

E2E tests cover the happy path only: they verify that a feature works end to
end, from user input to visible outcome. Edge cases, error states and timing
details are covered at the unit and integration levels.

### Running the suite

`npm run test` serves the built app, which loads `@pod-os/elements` from the
CDN. `npm run test:elements` targets the elements dev server on `localhost:3333`
and serves the local bundle. Features that are not in a released
`@pod-os/elements` bundle yet only run via `npm run test:elements`.

### Writing acceptance tests

E2E tests are acceptance tests from the user's perspective:

- **Speak user intention.** Test and step names describe what the user wants
  ("the user can follow the link to visit the mentioned thing"), never the
  mechanics ("clicking a button"). Condense steps that form one user action.
- **No technical steps.** A test neither probes the served bundle (e.g.
  `customElements.get(...)`) nor verifies environment prerequisites — choosing
  the right config (see above) is that job.
- **Feature placement.** A test belongs to the spec file of the UI surface it
  exercises: a markdown-editor feature goes into `markdown-editing.spec.ts`, not
  into a spec file of its own.

### Page objects

E2E tests interact through page and component objects
(`apps/tests/page-objects/`):

- **Describe every locator.** Locators a test acts on carry `.describe("...")`
  with a semantic name from the user's perspective ("Edit button", "Editor") —
  the name reads as the object the user works with, not the DOM role it happens
  to have.
- **Extract page and component objects.** Repeated DOM detail moves into a page
  object; a component with its own locators is a component object. Tests speak
  in intention (`editor.replaceContent(...)`), not in locators.
- **Children are obtained through their owner.** A popup or menu belonging to a
  UI element is exposed as a child of that element's page object
  (`editor.mentionMenu()`), never instantiated in the test. Mounting details
  (e.g. a popup attached to `document.body`) are the object's concern.
- **Scope assertions to the containing object.** Assert content where it lives
  (`editor.link(...)`), not against the whole page — a match elsewhere must not
  pass the assertion.
