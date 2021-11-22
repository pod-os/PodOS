import { newSpecPage } from '@stencil/core/testing';
import { PosLiterals } from './pos-literals';

describe('pos-literals', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-literals>
        <mock:shadow-root></mock:shadow-root>
      </pos-literals>
  `);
  });

  it('renders predicate and values', async () => {
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
    });
    await page.rootInstance.setResource({
      literals: () => [
        {
          predicate: 'http://schema.org/name',
          values: ['Alice'],
        },
      ],
    });
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('http://schema.org/name');
    expect(page.root.shadowRoot.textContent).toContain('Alice');
  });
});
