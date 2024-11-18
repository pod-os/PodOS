import { newSpecPage } from '@stencil/core/testing';

import { getByText } from '@testing-library/dom';

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
    await page.rootInstance.receiveResource({
      reverseRelations: () => [
        {
          predicate: 'http://schema.org/knows',
          label: 'knows',
          uris: ['https://person.test/alice'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    const knows = el.querySelector('pos-predicate[uri="http://schema.org/knows"]');
    expect(knows).toEqualAttribute('label', 'is knows of');
    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice"]');
    expect(linkToAlice).not.toBeNull();
  });

  it('renders multiple predicates and rich links to resource', async () => {
    const page = await newSpecPage({
      components: [PosReverseRelations],
      html: `<pos-reverse-relations />`,
    });
    await page.rootInstance.receiveResource({
      reverseRelations: () => [
        {
          predicate: 'http://schema.org/knows',
          label: 'participant',
          uris: ['https://person.test/alice', 'https://person.test/bernadette'],
        },
        {
          predicate: 'http://schema.org/participant',
          label: 'participant',
          uris: ['https://event.test/party'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    const knows = el.querySelector('pos-predicate[uri="http://schema.org/participant"]');
    expect(knows).toEqualAttribute('label', 'is participant of');
    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice"]');
    expect(linkToAlice).not.toBeNull();
    const linkToBernadette = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/bernadette"]');
    expect(linkToBernadette).not.toBeNull();

    const participant = el.querySelector('pos-predicate[uri="http://schema.org/participant"]');
    expect(participant).toEqualAttribute('label', 'is participant of');
    const linkToAttachment = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://event.test/party"]');
    expect(linkToAttachment).not.toBeNull();
  });
});
