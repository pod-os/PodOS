import { newSpecPage } from '@stencil/core/testing';
import { PosLabel } from './pos-label';

describe('pos-label', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosLabel],
      html: `<pos-label>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-label>
        <mock:shadow-root></mock:shadow-root>
      </pos-label>
  `);
  });

  it('renders label from resource', async () => {
    const page = await newSpecPage({
      components: [PosLabel],
      html: `<pos-label>`,
    });
    await page.rootInstance.setResource({
      label: () => 'Test Resource',
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-label>
        <mock:shadow-root>Test Resource</mock:shadow-root>
      </pos-label>
  `);
  });
});
