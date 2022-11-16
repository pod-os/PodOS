jest.mock('@pod-os/core', () => ({}));

import { newSpecPage } from '@stencil/core/testing';

import { PosTypeBadges } from './pos-type-badges';

describe('pos-type-badges', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosTypeBadges],
      html: `<pos-type-badges />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-type-badges>
        <mock:shadow-root>
        </mock:shadow-root>
      </pos-type-badges>
  `);
  });

  it('renders single type', async () => {
    const page = await newSpecPage({
      components: [PosTypeBadges],
      html: `<pos-type-badges />`,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          uri: 'https://vocab.test/SomeType',
          label: 'SomeType',
        },
      ],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('ion-badge')).toEqualHtml(`<ion-badge>SomeType</ion-badge>`);
  });

  it('renders multiple types', async () => {
    const page = await newSpecPage({
      components: [PosTypeBadges],
      html: `<pos-type-badges />`,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          uri: 'https://vocab.test/SomeType',
          label: 'SomeType',
        },
        {
          uri: 'https://vocab.test/SecondType',
          label: 'SecondType',
        },
        {
          uri: 'https://vocab.test/AnotherType',
          label: 'AnotherType',
        },
      ],
    });
    await page.waitForChanges();

    let badges = page.root.shadowRoot.querySelectorAll('ion-badge');
    expect(badges[0]).toEqualHtml(`<ion-badge>SomeType</ion-badge>`);
    expect(badges[1]).toEqualHtml(`<ion-badge>SecondType</ion-badge>`);
    expect(badges[2]).toEqualHtml(`<ion-badge>AnotherType</ion-badge>`);
    expect(badges[3]).toEqualHtml(`<ion-badge class="toggle"><ion-icon name="expand-outline"></ion-icon></ion-badge>`);
    expect(badges).toHaveLength(4);
  });

  it('renders only one badge for the same type label from different vocabs', async () => {
    const page = await newSpecPage({
      components: [PosTypeBadges],
      html: `<pos-type-badges />`,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          uri: 'https://vocab.test/SomeType',
          label: 'SomeType',
        },
        {
          uri: 'https://second-vocab.test/SomeType',
          label: 'SomeType',
        },
        {
          uri: 'https://another-vocab.test/SomeType',
          label: 'SomeType',
        },
      ],
    });
    await page.waitForChanges();

    let badges = page.root.shadowRoot.querySelectorAll('ion-badge');
    expect(badges[0]).toEqualText(`SomeType`);
    expect(badges[1]).not.toEqualText(`SomeType`);
  });

  it('renders all type URIs when expanded', async () => {
    const page = await newSpecPage({
      components: [PosTypeBadges],
      html: `<pos-type-badges />`,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          uri: 'https://vocab.test/SomeType',
          label: 'SomeType',
        },
        {
          uri: 'https://second-vocab.test/SomeType',
          label: 'SomeType',
        },
        {
          uri: 'https://another-vocab.test/SomeType',
          label: 'SomeType',
        },
      ],
    });
    await page.rootInstance.toggleDetails();
    await page.waitForChanges();

    let badges = page.root.shadowRoot.querySelectorAll('ion-badge');
    expect(badges[0]).toEqualHtml(`<ion-badge class="toggle"><ion-icon name="contract-outline"></ion-icon></ion-badge>`);
    expect(badges[1]).toEqualHtml(`<ion-badge>https://vocab.test/SomeType</ion-badge>`);
    expect(badges[2]).toEqualHtml(`<ion-badge>https://second-vocab.test/SomeType</ion-badge>`);
    expect(badges[3]).toEqualHtml(`<ion-badge>https://another-vocab.test/SomeType</ion-badge>`);
    expect(badges).toHaveLength(4);
  });
});
