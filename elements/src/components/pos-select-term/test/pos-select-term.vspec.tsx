import { vi } from 'vitest';
import { describe, expect, it, render, h } from '@stencil/vitest';
import { fireEvent } from '@testing-library/dom';
import '../pos-select-term';

describe('pos-select-term', () => {
  it('renders empty list initially', async () => {
    const page = await render(<pos-select-term></pos-select-term>);
    expect(page.root.shadowRoot).toEqualHtml(`
      <input part="input" list="terms" placeholder="Type to search...">
      <datalist part="terms" id="terms"></datalist>
    `);
  });

  it('uses passed value as input value', async () => {
    const page = await render(<pos-select-term value="initial"></pos-select-term>);
    expect(page.root.shadowRoot!.querySelector('input')!.value).toEqual('initial');
  });

  it('renders list of terms after os is available', async () => {
    const page = await render(<pos-select-term></pos-select-term>);
    page.instance.receivePodOs({
      listKnownTerms: () => [
        {
          uri: 'http://schema.org/name',
          shorthand: 'schema:name',
        },
      ],
    });
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
      <input part="input" list="terms" placeholder="Type to search...">
      <datalist part="terms" id="terms">
        <option value="http://schema.org/name">
          schema:name
        </option>
      </datalist>
    `);
  });

  it('fires event when term is entered', async () => {
    const page = await render(<pos-select-term></pos-select-term>);
    page.instance.receivePodOs({
      listKnownTerms: () => [
        {
          uri: 'http://schema.org/name',
          shorthand: 'schema:name',
        },
      ],
    });
    await page.waitForChanges();

    const onTermSelected = vi.fn();
    page.root.addEventListener('pod-os:term-selected', onTermSelected);

    const input = page.root.shadowRoot!.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'http://schema.org/name' } });

    expect(onTermSelected).toHaveBeenCalled();
    expect(onTermSelected.mock.calls[0][0].detail).toEqual({ uri: 'http://schema.org/name' });
  });
});
