import { newSpecPage } from '@stencil/core/testing';
import { PosInternalRouter } from './pos-internal-router';

describe('pos-internal-router', () => {
  it('renders the dashboard by default', async () => {
    const page = await newSpecPage({
      components: [PosInternalRouter],
      html: `<pos-internal-router />`,
    });

    expect(page.root).toEqualHtml(`
      <pos-internal-router>
         <pos-app-dashboard></pos-app-dashboard>
      </pos-internal-router>
    `);
  });
});
