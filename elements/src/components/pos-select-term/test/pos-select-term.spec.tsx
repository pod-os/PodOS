import { newSpecPage } from '@stencil/core/testing';
import { PosSelectTerm } from '../pos-select-term';

describe('pos-select-term', () => {
  it('renders empty list initially', async () => {
    const page = await newSpecPage({
      components: [PosSelectTerm],
      html: `<pos-select-term></pos-select-term>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-select-term>
        <mock:shadow-root>
          <input list="terms" placeholder="Type to search...">
          <datalist id="terms"></datalist>
        </mock:shadow-root>
      </pos-select-term>
    `);
  });

  it('renders list of terms after os is available', async () => {
    const page = await newSpecPage({
      components: [PosSelectTerm],
      html: `<pos-select-term></pos-select-term>`,
    });
    page.rootInstance.receivePodOs({
      listKnownTerms: () => [
        {
          uri: 'http://schema.org/name',
          shorthand: 'schema:name',
        },
      ],
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-select-term>
        <mock:shadow-root>
          <input list="terms" placeholder="Type to search...">
          <datalist id="terms">
            <option value="http://schema.org/name">schema:name</option>
          </datalist>
        </mock:shadow-root>
      </pos-select-term>
    `);
  });
});
