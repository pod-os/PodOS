import { describe, expect, h, it, render } from '@stencil/vitest';

import './pos-mention-menu';

describe('pos-mention-menu', () => {
  it('renders empty', async () => {
    const page = await render(<pos-mention-menu items={[]}></pos-mention-menu>);

    expect(page.root).toMatchInlineSnapshot(`
        <pos-mention-menu class="hydrated">
          <sl-menu></sl-menu>
        </pos-mention-menu>
    `);
  });

  it('renders single option', async () => {
    const items = [
      {
        id: 'https://resource.test',
        label: 'Something',
      },
    ];
    const page = await render(<pos-mention-menu items={items}></pos-mention-menu>);

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <sl-menu>
          <sl-menu-item>
            Something
          </sl-menu-item>
        </sl-menu>
      </pos-mention-menu>
    `);
  });

  it('renders multiple options', async () => {
    const items = [
      {
        id: 'https://first.test',
        label: 'First',
      },
      {
        id: 'https://second.test',
        label: 'Second',
      },
    ];
    const page = await render(<pos-mention-menu items={items}></pos-mention-menu>);

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <sl-menu>
          <sl-menu-item>
            First
          </sl-menu-item>
          <sl-menu-item>
            Second
          </sl-menu-item>
        </sl-menu>
      </pos-mention-menu>
    `);
  });
});
