jest.mock('@pod-os/core', () => ({}));

import { newSpecPage } from '@stencil/core/testing';

import { PosContainerContents } from './pos-container-contents';

describe('pos-container-contents', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-container-contents>
        <mock:shadow-root></mock:shadow-root>
      </pos-container-contents>
  `);
  });

  it('renders single file and a link to it', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        contains: () => [
          {
            uri: 'https://pod.test/container/file',
            name: 'file',
          },
        ],
      }),
    });
    await page.waitForChanges();

    const linkToFile = page.root.shadowRoot.querySelector('ion-item[href="https://pod.test/container/file"]');
    expect(linkToFile).not.toBeNull();
  });

  it('renders multiple contents and links to them', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        contains: () => [
          {
            uri: 'https://pod.test/container/file',
            name: 'file',
          },
          {
            uri: 'https://pod.test/container/subdir/',
            name: 'subdir',
          },
        ],
      }),
    });
    await page.waitForChanges();

    const linkToFile = page.root.shadowRoot.querySelector('ion-item[href="https://pod.test/container/file"]');
    expect(linkToFile).not.toBeNull();

    const linkToSubdir = page.root.shadowRoot.querySelector('ion-item[href="https://pod.test/container/subdir/"]');
    expect(linkToSubdir).not.toBeNull();
  });
});
