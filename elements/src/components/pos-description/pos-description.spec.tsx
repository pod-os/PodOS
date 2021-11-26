import { newSpecPage } from '@stencil/core/testing';
import { PosDescription } from './pos-description.component';

describe('pos-description', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosDescription],
      html: `<pos-description />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root></mock:shadow-root>
      </pos-description>
  `);
  });

  it('renders description from resource', async () => {
    const page = await newSpecPage({
      components: [PosDescription],
      html: `<pos-description />`,
    });
    await page.rootInstance.setResource({
      description: () => 'Test Resource',
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root>Test Resource</mock:shadow-root>
      </pos-description>
  `);
  });
});
