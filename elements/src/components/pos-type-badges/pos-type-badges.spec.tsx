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
          <div class="types">
          </div>
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

    expect(page.root).toEqualHtml(`
      <pos-type-badges>
        <mock:shadow-root>
          <div class="types">
            <ion-badge>SomeType</ion-badge>
          </div>
        </mock:shadow-root>
      </pos-type-badges>
  `);
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

    expect(page.root).toEqualHtml(`
      <pos-type-badges>
        <mock:shadow-root>
          <div class="types">
            <ion-badge>SomeType</ion-badge>
            <ion-badge>SecondType</ion-badge>
            <ion-badge>AnotherType</ion-badge>
          </div>
        </mock:shadow-root>
      </pos-type-badges>
  `);
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

    expect(page.root).toEqualHtml(`
      <pos-type-badges>
        <mock:shadow-root>
          <div class="types">
            <ion-badge>SomeType</ion-badge>
          </div>
        </mock:shadow-root>
      </pos-type-badges>
  `);
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
    expect(page.root).toEqualHtml(`
      <pos-type-badges>
        <mock:shadow-root>
          <div class="expanded types">
            <ion-badge>https://vocab.test/SomeType</ion-badge>
            <ion-badge>https://second-vocab.test/SomeType</ion-badge>
            <ion-badge>https://another-vocab.test/SomeType</ion-badge>
          </div>
        </mock:shadow-root>
      </pos-type-badges>
  `);
  });
});
