import { expect, RenderResult } from '@stencil/vitest';
import { within } from '@testing-library/dom';

export function withinShadow(page: RenderResult) {
  expect(page.root.shadowRoot).toBeDefined();
  const shadowRoot = page.root.shadowRoot as unknown as HTMLElement;
  return within(shadowRoot);
}
