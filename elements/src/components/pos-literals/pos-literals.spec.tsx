import { newSpecPage } from '@stencil/core/testing';

import { getByText } from '@testing-library/dom';

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

  it('renders single predicate and value', async () => {
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
    });
    await page.rootInstance.receiveResource({
      literals: () => [
        {
          predicate: 'http://schema.org/name',
          values: ['Alice'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    expect(getByText(el, 'http://schema.org/name')).toBeDefined();
  });

  it('renders multiple predicates and values', async () => {
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
    });
    await page.rootInstance.receiveResource({
      literals: () => [
        {
          predicate: 'http://schema.org/name',
          values: ['Alice', 'Bernadette'],
        },
        {
          predicate: 'http://schema.org/description',
          values: ['the description'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    expect(getByText(el, 'Bernadette')).toBeDefined();
    expect(getByText(el, 'http://schema.org/name')).toBeDefined();

    expect(getByText(el, 'the description')).toBeDefined();
    expect(getByText(el, 'http://schema.org/description')).toBeDefined();
  });
});
