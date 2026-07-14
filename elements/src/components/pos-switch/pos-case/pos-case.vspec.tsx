import { describe, expect, it, render, h } from '@stencil/vitest';

import './pos-case';

describe('pos-case', () => {
  it('contains only templates initially', async () => {
    const page = await render(
      <pos-case if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    expect(page.root).toEqualHtml(`
      <pos-case if-typeof="http://schema.org/Recipe" class="hydrated">
        <template></template>
      </pos-case>
    `);
  });

  it('renders empty by default', async () => {
    const page = await render(
      <pos-case if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    const el: HTMLElement = page.root as unknown as HTMLElement;
    expect(el.textContent).toEqualHtml('');
  });

  it('displays error on missing template', async () => {
    const page = await render(<pos-case></pos-case>);
    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.textContent).toEqual('No template element found');
  });
});
