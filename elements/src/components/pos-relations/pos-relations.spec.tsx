import { newSpecPage } from '@stencil/core/testing';

import { fireEvent } from '@testing-library/dom';

import { PosRelations } from './pos-relations';
import { Relation } from '@pod-os/core';

describe('pos-relations', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-relations>
        <mock:shadow-root>
          <pos-add-relation></pos-add-relation>
        </mock:shadow-root>
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

  it('adds newly added relation to the list', async () => {
    // given
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      relations: () => [],
    });
    await page.waitForChanges();

    // when
    const input = page.root.querySelector('pos-add-relation');
    const relation: Relation = {
      predicate: 'http://xmlns.com/foaf/0.1/knows',
      label: 'knows',
      uris: ['https://alice.test/profile/card#me'],
    };
    fireEvent(
      input,
      new CustomEvent('pod-os:added-relation', {
        detail: relation,
      }),
    );

    await page.waitForChanges();

    const url = page.root.querySelector('pos-predicate[uri="http://xmlns.com/foaf/0.1/knows"]');
    expect(url).toEqualAttribute('label', 'knows');
    const linkToAlice = page.root.querySelector('pos-rich-link[uri="https://alice.test/profile/card#me"]');
    expect(linkToAlice).not.toBeNull();
  });

  it('adds newly added relation to the existing list without duplicating the predicate', async () => {
    // given
    const page = await newSpecPage({
      components: [PosRelations],
      html: `<pos-relations />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      relations: () => [
        {
          predicate: 'http://xmlns.com/foaf/0.1/knows',
          label: 'knows',
          uris: ['https://alice.test/profile/card#me'],
        },
      ],
    });
    await page.waitForChanges();

    // when
    const input = page.root.querySelector('pos-add-relation');
    const relation: Relation = {
      predicate: 'http://xmlns.com/foaf/0.1/knows',
      label: 'knows',
      uris: ['https://bernadette.test/profile/card#me'],
    };
    fireEvent(
      input,
      new CustomEvent('pod-os:added-relation', {
        detail: relation,
      }),
    );

    await page.waitForChanges();

    // then
    const knows = page.root.querySelectorAll('pos-predicate[uri="http://xmlns.com/foaf/0.1/knows"]');
    expect(knows).toHaveLength(1);
    expect(knows[0]).toEqualAttribute('label', 'knows');
    const linkToAlice = page.root.querySelector('pos-rich-link[uri="https://alice.test/profile/card#me"]');
    expect(linkToAlice).not.toBeNull();
    const linkToBernadette = page.root.querySelector('pos-rich-link[uri="https://bernadette.test/profile/card#me"]');
    expect(linkToBernadette).not.toBeNull();
  });
});
