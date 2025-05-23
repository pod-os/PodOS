import { newSpecPage } from '@stencil/core/testing';

import { getByText } from '@testing-library/dom';

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

  it('renders single predicate and rich link to resource', async () => {
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
    });
    await page.rootInstance.receiveResource({
      relations: () => [
        {
          predicate: 'http://schema.org/url',
          label: 'url',
          uris: ['https://person.test/alice'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    const url = el.querySelector('pos-predicate[uri="http://schema.org/url"]');
    expect(url).toEqualAttribute('label', 'url');
    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice"]');
    expect(linkToAlice).not.toBeNull();
  });

  it('renders multiple predicates and rich links to resource', async () => {
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
    });
    await page.rootInstance.receiveResource({
      relations: () => [
        {
          predicate: 'http://schema.org/url',
          label: 'url',
          uris: ['https://person.test/alice', 'https://person.test/bernadette'],
        },
        {
          predicate: 'https://www.w3.org/ns/activitystreams#attachment',
          label: 'attachment',
          uris: ['https://resource.test/attachment'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    const url = el.querySelector('pos-predicate[uri="http://schema.org/url"]');
    expect(url).toEqualAttribute('label', 'url');
    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice"]');
    expect(linkToAlice).not.toBeNull();
    const linkToBernadette = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/bernadette"]');
    expect(linkToBernadette).not.toBeNull();

    const attachment = el.querySelector('pos-predicate[uri="https://www.w3.org/ns/activitystreams#attachment"]');
    expect(attachment).toEqualAttribute('label', 'attachment');
    const linkToAttachment = page.root.shadowRoot.querySelector(
      'pos-rich-link[uri="https://resource.test/attachment"]',
    );
    expect(linkToAttachment).not.toBeNull();
  });
});
