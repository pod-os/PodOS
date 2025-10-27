import { fireEvent } from '@testing-library/dom';

jest.mock('@pod-os/core', () => ({}));

import { newSpecPage } from '@stencil/core/testing';

import { PosContainerContents } from './pos-container-contents';
import { Components } from '../../components';
import PosCreateNewContainerItem = Components.PosCreateNewContainerItem;

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
        <pos-container-toolbar></pos-container-toolbar>
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

  describe('new files and folders', () => {
    it('shows input to create a new file when event occurs', async () => {
      // Given a page with container contents
      const page = await newSpecPage({
        components: [PosContainerContents],
        html: `<pos-container-contents />`,
        supportsShadowDom: false,
      });

      // and a container resource is available
      const container = {
        contains: () => [],
      };
      await page.rootInstance.receiveResource({
        assume: () => container,
      });
      await page.waitForChanges();

      // when the toolbar fires a create-new-file event
      const toolbar = page.root.querySelector('pos-container-toolbar');
      expect(toolbar).not.toBeNull();
      fireEvent(toolbar, new CustomEvent('pod-os:create-new-file', {}));
      await page.waitForChanges();

      // then the input to create a new file is shown
      expect(page.root).toEqualHtml(`
      <pos-container-contents>
        <pos-container-toolbar></pos-container-toolbar>
        <ul>
          <li><pos-create-new-container-item type="file"></pos-create-new-container-item></li>
        </ul>
      </pos-container-contents>
  `);

      // and the current container is passed into it
      const createNew: PosCreateNewContainerItem = page.root.querySelector('pos-create-new-container-item');
      expect(createNew.container).toEqual(container);
    });

    it('shows input to create a new container when event occurs', async () => {
      // Given a page with container contents
      const page = await newSpecPage({
        components: [PosContainerContents],
        html: `<pos-container-contents />`,
        supportsShadowDom: false,
      });

      // and a container resource is available
      const container = {
        contains: () => [],
      };
      await page.rootInstance.receiveResource({
        assume: () => container,
      });
      await page.waitForChanges();

      // when the toolbar fires a create-new-folder event
      const toolbar = page.root.querySelector('pos-container-toolbar');
      expect(toolbar).not.toBeNull();
      fireEvent(toolbar, new CustomEvent('pod-os:create-new-folder', {}));
      await page.waitForChanges();

      // then the input to create a new folder is shown
      expect(page.root).toEqualHtml(`
      <pos-container-contents>
        <pos-container-toolbar></pos-container-toolbar>
        <ul>
          <li><pos-create-new-container-item type="folder"></pos-create-new-container-item></li>
        </ul>
      </pos-container-contents>
  `);

      // and the current container is passed into it
      const createNew: PosCreateNewContainerItem = page.root.querySelector('pos-create-new-container-item');
      expect(createNew.container).toEqual(container);
    });
  });
});
