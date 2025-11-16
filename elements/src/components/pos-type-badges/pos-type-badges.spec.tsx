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

    expect(page.root.shadowRoot.querySelector('li')).toEqualHtml(`<li>SomeType</li>`);
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

    let badges = page.root.shadowRoot.querySelectorAll('li');
    expect(badges[0]).toEqualHtml(`<li>SomeType</li>`);
    expect(badges[1]).toEqualHtml(`<li>SecondType</li>`);
    expect(badges[2]).toEqualHtml(`<li>AnotherType</li>`);
    expect(badges).toHaveLength(3);
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

    let badges = page.root.shadowRoot.querySelectorAll('li');
    expect(badges[0]).toEqualText(`SomeType`);
    expect(badges).toHaveLength(1);

    const button = page.root.shadowRoot.querySelector('button');
    expect(button).toEqualHtml(`
      <button class="toggle">
        <sl-icon name="arrows-expand"></sl-icon>
      </button>
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

    const badges = page.root.shadowRoot.querySelectorAll('li');
    expect(badges[0]).toEqualHtml(`<li>https://vocab.test/SomeType</li>`);
    expect(badges[1]).toEqualHtml(`<li>https://second-vocab.test/SomeType</li>`);
    expect(badges[2]).toEqualHtml(`<li>https://another-vocab.test/SomeType</li>`);
    expect(badges).toHaveLength(3);

    const button = page.root.shadowRoot.querySelector('button');
    expect(button).toEqualHtml(`
      <button class="toggle">
        <sl-icon name="arrows-collapse"></sl-icon>
      </button>
    `);
  });
});
