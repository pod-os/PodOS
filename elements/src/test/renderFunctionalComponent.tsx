import { newSpecPage } from '@stencil/core/testing';
import { TestComponent } from './TestComponent';

export function renderFunctionalComponent(jsx: any) {
  return newSpecPage({
    components: [TestComponent],
    template: () => jsx,
  });
}
