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
      supportsShadowDom: false,
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

    expect(page.root).toEqualHtml(`
      <pos-container-contents>
        <pos-container-toolbar></pos-container-toolbar>
        <ul>
          <li>
            <pos-resource lazy="" uri="https://pod.test/container/file">
              <pos-container-item>
                file
              </pos-container-item>
            </pos-resource>
          </li>
        </ul>
      </pos-container-contents>`);
  });

  it('renders a note about container being empty', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        contains: () => [],
      }),
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`<pos-container-contents>
      <mock:shadow-root>
        <p>
          The container is empty
        </p>
      </mock:shadow-root>
    </pos-container-contents>
 `);
  });

  it('renders multiple contents and links to them, sorted alphabetically', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
      supportsShadowDom: false,
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
          {
            uri: 'https://pod.test/container/a-file-on-top-of-the-list',
            name: 'a-file-on-top-of-the-list',
          },
        ],
      }),
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <pos-container-contents>
        <pos-container-toolbar></pos-container-toolbar>
        <ul>
          <li>
            <pos-resource lazy="" uri="https://pod.test/container/a-file-on-top-of-the-list">
              <pos-container-item>
                a-file-on-top-of-the-list
              </pos-container-item>
            </pos-resource>
          </li>
          <li>
            <pos-resource lazy="" uri="https://pod.test/container/file">
              <pos-container-item>
                file
              </pos-container-item>
            </pos-resource>
          </li>
          <li>
            <pos-resource lazy="" uri="https://pod.test/container/subdir/">
              <pos-container-item>
                subdir
              </pos-container-item>
            </pos-resource>
          </li>
        </ul>
      </pos-container-contents>
    `);
  });
});
