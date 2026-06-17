import { vi } from 'vitest';
import { beforeEach, describe, expect, it, render, h } from '@stencil/vitest';
import { fireEvent } from '@testing-library/dom';

import './pos-container-contents';

import { Components, LdpContainer } from '../../components';
import PosCreateNewContainerItem = Components.PosCreateNewContainerItem;
import { pressKey } from '../../test/pressKey';
import { Subject } from 'rxjs';
import { ContainerContent, Thing } from '@pod-os/core';
import { mockResource } from '../../test/mockResource';

vi.mock('@pod-os/core', () => ({
  LdpContainer: class {},
}));

describe('pos-container-contents', () => {
  let container: LdpContainer, observed$: Subject<ContainerContent[]>, resource: Thing;
  beforeEach(() => {
    // Given a container
    observed$ = new Subject<ContainerContent[]>();
    container = {
      observeContains: () => observed$,
    } as unknown as LdpContainer;

    // available as a resource
    resource = {
      assume: () => container,
    } as unknown as Thing;
  });

  it('are empty initially', async () => {
    const page = await render(<pos-container-contents></pos-container-contents>);
    expect(page.root).toBeEmptyDOMElement();
  });

  it('renders single file and a link to it', async () => {
    mockResource(resource);
    const page = await render(<pos-container-contents></pos-container-contents>);

    observed$.next([
      {
        uri: 'https://pod.test/container/file',
        name: 'file',
      },
    ]);
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
        <pos-container-toolbar></pos-container-toolbar>
        <ul aria-label="Container contents">
          <li>
            <pos-resource lazy uri="https://pod.test/container/file">
              <pos-container-item>
                file
              </pos-container-item>
            </pos-resource>
          </li>
        </ul>`);
  });

  it('renders a note about container being empty', async () => {
    mockResource(resource);
    const page = await render(<pos-container-contents></pos-container-contents>);

    observed$.next([]);
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <pos-container-toolbar></pos-container-toolbar>
      <p>
        The container is empty
      </p>
    `);
  });

  it('renders multiple contents and links to them, sorted alphabetically', async () => {
    mockResource(resource);
    const page = await render(<pos-container-contents></pos-container-contents>);

    observed$.next([
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
    ]);
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
        <pos-container-toolbar></pos-container-toolbar>
        <ul aria-label="Container contents">
          <li>
            <pos-resource lazy uri="https://pod.test/container/a-file-on-top-of-the-list">
              <pos-container-item>
                a-file-on-top-of-the-list
              </pos-container-item>
            </pos-resource>
          </li>
          <li>
            <pos-resource lazy uri="https://pod.test/container/file">
              <pos-container-item>
                file
              </pos-container-item>
            </pos-resource>
          </li>
          <li>
            <pos-resource lazy uri="https://pod.test/container/subdir/">
              <pos-container-item>
                subdir
              </pos-container-item>
            </pos-resource>
          </li>
        </ul>
    `);
  });

  it('re-renders when container contents in store change', async () => {
    mockResource(resource);
    const page = await render(<pos-container-contents></pos-container-contents>);

    observed$.next([
      {
        uri: 'https://pod.test/container/file',
        name: 'file',
      },
    ]);
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
        <pos-container-toolbar></pos-container-toolbar>
        <ul aria-label="Container contents">
          <li>
            <pos-resource lazy uri="https://pod.test/container/file">
              <pos-container-item>
                file
              </pos-container-item>
            </pos-resource>
          </li>
        </ul>`);

    observed$.next([
      {
        uri: 'https://pod.test/container/file-1',
        name: 'file-1',
      },
    ]);
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
        <pos-container-toolbar></pos-container-toolbar>
        <ul aria-label="Container contents">
          <li>
            <pos-resource lazy uri="https://pod.test/container/file-1">
              <pos-container-item>
                file-1
              </pos-container-item>
            </pos-resource>
          </li>
        </ul>
    `);
  });

  describe('new files and folders', () => {
    let page: any;
    beforeEach(async () => {
      // and given a page with container contents
      mockResource(resource);
      page = await render(<pos-container-contents></pos-container-contents>);

      // as well as (empty) container contents
      observed$.next([]);
      await page.waitForChanges();
    });

    it('shows input to create a new file when event occurs', async () => {
      // when the toolbar fires a create-new-file event
      const toolbar = page.root.shadowRoot!.querySelector('pos-container-toolbar')!;
      expect(toolbar).not.toBeNull();
      fireEvent(toolbar, new CustomEvent('pod-os:create-new-file', {}));
      await page.waitForChanges();

      // then the input to create a new file is shown
      expect(page.root.shadowRoot).toEqualHtml(`
        <pos-container-toolbar></pos-container-toolbar>
        <ul aria-label="Container contents">
          <li><pos-create-new-container-item type="file"></pos-create-new-container-item></li>
        </ul>
  `);

      // and the current container is passed into it
      const createNew: PosCreateNewContainerItem = page.root.shadowRoot.querySelector('pos-create-new-container-item');
      expect(createNew.container).toEqual(container);
    });

    it('shows input to create a new container when event occurs', async () => {
      // when the toolbar fires a create-new-folder event
      const toolbar = page.root.shadowRoot.querySelector('pos-container-toolbar');
      expect(toolbar).not.toBeNull();
      fireEvent(toolbar, new CustomEvent('pod-os:create-new-folder', {}));
      await page.waitForChanges();

      // then the input to create a new folder is shown
      expect(page.root.shadowRoot).toEqualHtml(`
        <pos-container-toolbar></pos-container-toolbar>
        <ul aria-label="Container contents">
          <li><pos-create-new-container-item type="folder"></pos-create-new-container-item></li>
        </ul>
  `);

      // and the current container is passed into it
      const createNew: PosCreateNewContainerItem = page.root.shadowRoot.querySelector('pos-create-new-container-item');
      expect(createNew.container).toEqual(container);
    });

    it('hides input to create a new file or folder when escape is pressed', async () => {
      // and a new file should be created
      await createNewFile(page);
      expect(page.root.querySelector('pos-create-new-container-item')).toBeDefined();

      // when the user presses escape
      await pressKey(page, 'Escape');

      // then the input is hidden
      expect(page.root.querySelector('pos-create-new-container-item')).toBeNull();
    });
  });
});

async function createNewFile(page: any) {
  const toolbar = page.root.shadowRoot!.querySelector('pos-container-toolbar')!;
  expect(toolbar).not.toBeNull();
  fireEvent(toolbar, new CustomEvent('pod-os:create-new-file', {}));
  await page.waitForChanges();
}
