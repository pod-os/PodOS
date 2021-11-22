import { newSpecPage } from '@stencil/core/testing';

import { getByText } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { PosRelations } from './pos-relations';

describe('pos-relations', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-relations>
        <mock:shadow-root></mock:shadow-root>
      </pos-relations>
  `);
  });

  it('renders single predicate and value', async () => {
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
    });
    await page.rootInstance.setResource({
      relations: () => [
        {
          predicate: 'http://schema.org/url',
          uris: ['Alice'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    expect(getByText(el, 'http://schema.org/url')).toBeDefined();
  });

  it('renders multiple predicates and values', async () => {
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
    });
    await page.rootInstance.setResource({
      relations: () => [
        {
          predicate: 'http://schema.org/url',
          uris: ['Alice', 'Bernadette'],
        },
        {
          predicate: 'http://schema.org/description',
          uris: ['the description'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    expect(getByText(el, 'Bernadette')).toBeDefined();
    expect(getByText(el, 'http://schema.org/url')).toBeDefined();

    expect(getByText(el, 'the description')).toBeDefined();
    expect(getByText(el, 'http://schema.org/description')).toBeDefined();
  });
});
