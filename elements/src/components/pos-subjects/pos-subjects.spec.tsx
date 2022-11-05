jest.mock('@pod-os/core', () => ({}));

import { newSpecPage } from '@stencil/core/testing';

import { PosSubjects } from './pos-subjects';

describe('pos-subjects', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosSubjects],
      html: `<pos-subjects />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-subjects>
        <mock:shadow-root></mock:shadow-root>
      </pos-subjects>
  `);
  });

  it('renders single subject and rich link to it', async () => {
    const page = await newSpecPage({
      components: [PosSubjects],
      html: `<pos-subjects />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        subjects: () => [
          {
            uri: 'https://person.test/alice#me',
          },
        ],
      }),
    });
    await page.waitForChanges();

    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice#me"]');
    expect(linkToAlice).not.toBeNull();
  });

  it('renders multiple subjects and rich links to them', async () => {
    const page = await newSpecPage({
      components: [PosSubjects],
      html: `<pos-subjects />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        subjects: () => [
          {
            uri: 'https://person.test/alice#me',
          },
          {
            uri: 'https://person.test/alice#address',
          },
        ],
      }),
    });
    await page.waitForChanges();

    const linkToAlice = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice#me"]');
    expect(linkToAlice).not.toBeNull();

    const linkToAddress = page.root.shadowRoot.querySelector('pos-rich-link[uri="https://person.test/alice#address"]');
    expect(linkToAddress).not.toBeNull();
  });
});
