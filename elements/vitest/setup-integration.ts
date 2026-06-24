import { afterAll, afterEach, beforeAll } from 'vitest';

import { defineCustomElements } from '../loader';
import { server } from '../src/test/msw';

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
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
