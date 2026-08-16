import { afterAll, afterEach, beforeAll } from 'vitest';

import { defineCustomElements } from '../loader';
import { server } from '../src/test/msw';

import 'fake-indexeddb/auto'; // indexeddb is used by integration tests that use authentication

// happy-dom installs its own `fetch` on `globalThis` with a **non-writable, non-configurable** property descriptor
// while the `cross-fetch` browser ponyfill used by rdflib tries to overwrite it. This causes the tests to fail with
// "TypeError: 'fetch' is read-only". To prevent that, we make fetch writable again.
Object.defineProperty(globalThis, 'fetch', {
  writable: true,
  configurable: true,
  value: globalThis.fetch,
});

beforeAll(() => {
  defineCustomElements();
  server.listen();

  // sl-icon resolves icon URLs like `assets/icons/x.svg` relative to the document
  // base, which fails with a network error in tests. MSW cannot see these requests (they go through happy-dom's
  // browser-context fetch), so we short-circuit them at fetch level instead.
  // The svg response seems not actually to be used anywhere, but we make it explicit that it is a
  // mocked icon, just in case it shows up anywhere
  const innerFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes('assets/icons/')) {
      return new Response(
        `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <text>mock icon for ${url}</text>
          </svg>
        `,
        {
          status: 200,
          headers: { 'Content-Type': 'image/svg+xml' },
        },
      );
    }
    return innerFetch(input, init);
  }) as typeof fetch;
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
