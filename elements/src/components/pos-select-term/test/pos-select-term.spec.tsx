import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
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

  it('fires event when term is entered', async () => {
    const page = await newSpecPage({
      supportsShadowDom: false,
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

    const onTermSelected = jest.fn();
    page.root.addEventListener('pod-os:term-selected', onTermSelected);

    const input = page.root.querySelector('input');
    fireEvent.change(input, { target: { value: 'http://schema.org/name' } });

    expect(onTermSelected).toHaveBeenCalled();
    expect(onTermSelected.mock.calls[0][0].detail).toEqual({ uri: 'http://schema.org/name' });
  });
});
