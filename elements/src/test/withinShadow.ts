import { expect, RenderResult } from '@stencil/vitest';
import { within } from '@testing-library/dom';

type ShadowHost = RenderResult | Element;

export function withinShadow(host: ShadowHost) {
  const element = 'root' in host ? host.root : host;
  expect(element.shadowRoot).toBeDefined();
  const shadowRoot = element.shadowRoot as unknown as HTMLElement;
  return within(shadowRoot);
}
