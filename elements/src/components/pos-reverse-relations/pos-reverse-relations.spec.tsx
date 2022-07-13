import { newSpecPage } from '@stencil/core/testing';

import { getByText } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { PosReverseRelations } from './pos-reverse-relations';

describe('pos-reverse-relations', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosReverseRelations],
      html: `<pos-reverse-relations />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-reverse-relations>
        <mock:shadow-root></mock:shadow-root>
      </pos-reverse-relations>
  `);
  });

  it('renders single predicate and rich link to resource', async () => {
    const page = await newSpecPage({
      components: [PosReverseRelations],
      html: `<pos-reverse-relations />`,
    });
    await page.rootInstance.setResource({
      reverseRelations: () => [
        {
          predicate: 'http://schema.org/knows',
          uris: ['https://person.test/alice'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'is http://schema.org/knows of')).toBeDefined();
    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice"]');
    expect(linkToAlice).not.toBeNull();
  });

  it('renders multiple predicates and rich links to resource', async () => {
    const page = await newSpecPage({
      components: [PosReverseRelations],
      html: `<pos-reverse-relations />`,
    });
    await page.rootInstance.setResource({
      reverseRelations: () => [
        {
          predicate: 'http://schema.org/knows',
          uris: ['https://person.test/alice', 'https://person.test/bernadette'],
        },
        {
          predicate: 'http://schema.org/participant',
          uris: ['https://event.test/party'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'is http://schema.org/knows of')).toBeDefined();
    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice"]');
    expect(linkToAlice).not.toBeNull();
    const linkToBernadette = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/bernadette"]');
    expect(linkToBernadette).not.toBeNull();

    expect(getByText(el, 'is http://schema.org/participant of')).toBeDefined();
    const linkToAttachment = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://event.test/party"]');
    expect(linkToAttachment).not.toBeNull();
  });
});
