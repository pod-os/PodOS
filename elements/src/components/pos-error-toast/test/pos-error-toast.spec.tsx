import { newSpecPage } from '@stencil/core/testing';

import { PosErrorToast } from '../pos-error-toast';

describe('pos-error-toast', () => {
  it('renders its children', async () => {
    const page = await newSpecPage({
      components: [PosErrorToast],
      html: `<pos-error-toast></pos-error-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-error-toast>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pos-error-toast>
    `);
  });
});
