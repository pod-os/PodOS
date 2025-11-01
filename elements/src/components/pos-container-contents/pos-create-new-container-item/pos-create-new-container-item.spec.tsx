import { PodOS, HttpProblem } from '@pod-os/core';

jest.mock('../../events/usePodOS');

import { newSpecPage } from '@stencil/core/testing';
import { PosCreateNewContainerItem } from './pos-create-new-container-item';
import { usePodOS } from '../../events/usePodOS';
import { when } from 'jest-when';

import { mockPodOS } from '../../../test/mockPodOS';
import { fireEvent } from '@testing-library/dom';
import { errAsync, ok, okAsync } from 'neverthrow';

describe('pos-create-new-container-item', () => {
  let os: PodOS;
  beforeEach(() => {
    os = mockPodOS();
    when(usePodOS).mockResolvedValue(os);
  });

  it('renders input for new file', async () => {
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="file"/>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-create-new-container-item type="file">
        <form>
          <sl-icon name="file-earmark-plus"></sl-icon>
          <input placeholder="Enter file name" type="text">
        </form>
      </pos-create-new-container-item>
    `);
  });

  it('renders input for new folder', async () => {
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="folder"/>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-create-new-container-item type="folder">
        <form>
          <sl-icon name="folder-plus"></sl-icon>
          <input placeholder="Enter folder name" type="text">
        </form>
      </pos-create-new-container-item>
    `);
  });

  it('creates a new file in the container', async () => {
    // given a component to create a new file
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="file"/>`,
      supportsShadowDom: false,
    });
    page.rootInstance.container = { fake: 'Container' };
    // and the page listens to link events
    const linkListener = jest.fn();
    page.root.addEventListener('pod-os:link', linkListener);
    // and a new file can successfully be created
    when(os.files().createNewFile).mockResolvedValue(
      okAsync({
        url: 'https://pod.test/container/new-file.md',
        name: 'new-file.md',
        contentType: 'text/markdown',
      }),
    );
    // when the user enters a file name
    const input = page.root.querySelector('input');
    fireEvent.input(input, { target: { value: 'new-file.md' } });
    // and submits
    const form = page.root.querySelector('form');
    fireEvent.submit(form);
    // then the file is created
    expect(os.files().createNewFile).toHaveBeenCalledWith(page.rootInstance.container, 'new-file.md');
    // and the user is redirected to the new file
    await page.waitForChanges();
    expect(linkListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'https://pod.test/container/new-file.md',
      }),
    );
  });

  it('emits an error if file creation fails', async () => {
    // given a component to create a new file
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="file"/>`,
      supportsShadowDom: false,
    });
    page.rootInstance.container = { fake: 'Container' };
    // and the page listens to error events
    const errorListener = jest.fn();
    page.root.addEventListener('pod-os:error', errorListener);
    // and a new file fails to create
    const problem: HttpProblem = {
      type: 'http',
      title: 'Something failed',
    };
    when(os.files().createNewFile).mockResolvedValue(errAsync(problem));
    // when the user enters a file name
    const input = page.root.querySelector('input');
    fireEvent.input(input, { target: { value: 'new-file.md' } });
    // and submits
    const form = page.root.querySelector('form');
    fireEvent.submit(form);
    // then an error is emitted
    await page.waitForChanges();
    expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ detail: problem }));
  });

  it('creates a new folder in the container', async () => {
    // given a component to create a new folder
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="folder"/>`,
      supportsShadowDom: false,
    });
    page.rootInstance.container = { fake: 'Container' };
    // and the page listens to link events
    const linkListener = jest.fn();
    page.root.addEventListener('pod-os:link', linkListener);
    // and a new folder can successfully be created
    when(os.files().createNewFolder).mockResolvedValue(
      okAsync({
        url: 'https://pod.test/container/new-new-folder-2/',
        name: 'New New Folder 2',
      }),
    );
    // when the user enters a folder name
    const input = page.root.querySelector('input');
    fireEvent.input(input, { target: { value: 'New New Folder 2' } });
    // and submits
    const form = page.root.querySelector('form');
    fireEvent.submit(form);
    // then the folder is created
    expect(os.files().createNewFolder).toHaveBeenCalledWith(page.rootInstance.container, 'New New Folder 2');
    // and the user is redirected to the new folder
    await page.waitForChanges();
    expect(linkListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'https://pod.test/container/new-new-folder-2/',
      }),
    );
  });

  it('emits an error if folder creation fails', async () => {
    // given a component to create a new folder
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="folder"/>`,
      supportsShadowDom: false,
    });
    page.rootInstance.container = { fake: 'Container' };
    // and the page listens to error events
    const errorListener = jest.fn();
    page.root.addEventListener('pod-os:error', errorListener);
    // and a new folder fails to create
    const problem: HttpProblem = {
      type: 'http',
      title: 'Something failed',
    };
    when(os.files().createNewFolder).mockResolvedValue(errAsync(problem));
    // when the user enters a file name
    const input = page.root.querySelector('input');
    fireEvent.input(input, { target: { value: 'new-file.md' } });
    // and submits
    const form = page.root.querySelector('form');
    fireEvent.submit(form);
    // then an error is emitted
    await page.waitForChanges();
    expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ detail: problem }));
  });
});
