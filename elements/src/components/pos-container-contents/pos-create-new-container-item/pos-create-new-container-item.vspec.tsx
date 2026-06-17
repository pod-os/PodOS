import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';

import { HttpProblem, LdpContainer, PodOS } from '@pod-os/core';
import './pos-create-new-container-item';
import { usePodOS } from '../../events/usePodOS';

import { mockPodOS } from '../../../test/mockPodOS.vitest';
import { fireEvent } from '@testing-library/dom';
import { errAsync, okAsync } from 'neverthrow';

vi.mock('../../events/usePodOS');

describe('pos-create-new-container-item', () => {
  let os: PodOS;
  beforeEach(() => {
    os = mockPodOS();
    (usePodOS as Mock).mockResolvedValue(os);
  });

  it('renders input for new file', async () => {
    const page = await render(
      <pos-create-new-container-item type="file" container={{} as LdpContainer}></pos-create-new-container-item>,
    );

    expect(page.root.shadowRoot).toEqualHtml(`
        <form>
          <sl-icon name="file-earmark-plus"></sl-icon>
          <input type="text" placeholder="Enter file name">
        </form>
    `);
  });

  it('renders input for new folder', async () => {
    const page = await render(
      <pos-create-new-container-item type="folder" container={{} as LdpContainer}></pos-create-new-container-item>,
    );

    expect(page.root.shadowRoot).toEqualHtml(`
        <form>
          <sl-icon name="folder-plus"></sl-icon>
          <input type="text" placeholder="Enter folder name">
        </form>
    `);
  });

  it('creates a new file in the container', async () => {
    // given a component to create a new file
    const container = { fake: 'Container' } as unknown as LdpContainer;
    const page = await render(
      <pos-create-new-container-item type="file" container={container}></pos-create-new-container-item>,
    );
    // and the page listens to link events
    const linkListener = vi.fn();
    page.root.addEventListener('pod-os:link', linkListener);
    // and a new file can successfully be created
    (os.files().createNewFile as Mock).mockResolvedValue(
      okAsync({
        url: 'https://pod.test/container/new-file.md',
        name: 'new-file.md',
        contentType: 'text/markdown',
      }),
    );
    // when the user enters a file name
    const input = page.root.shadowRoot!.querySelector('input')!;
    fireEvent.input(input, { target: { value: 'new-file.md' } });
    // and submits
    const form = page.root.shadowRoot!.querySelector('form')!;
    fireEvent.submit(form);
    // then the file is created
    expect(os.files().createNewFile).toHaveBeenCalledWith(container, 'new-file.md');
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
    const container = { fake: 'Container' } as unknown as LdpContainer;
    const page = await render(
      <pos-create-new-container-item type="file" container={container}></pos-create-new-container-item>,
    );
    // and the page listens to error events
    const errorListener = vi.fn();
    page.root.addEventListener('pod-os:error', errorListener);
    // and a new file fails to create
    const problem: HttpProblem = {
      status: 999,
      type: 'http',
      title: 'Something failed',
    };
    (os.files().createNewFile as Mock).mockResolvedValue(errAsync(problem));
    // when the user enters a file name
    const input = page.root.shadowRoot!.querySelector('input')!;
    fireEvent.input(input, { target: { value: 'new-file.md' } });
    // and submits
    const form = page.root.shadowRoot!.querySelector('form')!;
    fireEvent.submit(form);
    // then an error is emitted
    await page.waitForChanges();
    expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ detail: problem }));
  });

  it('creates a new folder in the container', async () => {
    // given a component to create a new folder
    const container = { fake: 'Container' } as unknown as LdpContainer;
    const page = await render(
      <pos-create-new-container-item type="folder" container={container}></pos-create-new-container-item>,
    );
    // and the page listens to link events
    const linkListener = vi.fn();
    page.root.addEventListener('pod-os:link', linkListener);
    // and a new folder can successfully be created
    (os.files().createNewFolder as Mock).mockResolvedValue(
      okAsync({
        url: 'https://pod.test/container/new-new-folder-2/',
        name: 'New New Folder 2',
      }),
    );
    // when the user enters a folder name
    const input = page.root.shadowRoot!.querySelector('input')!;
    fireEvent.input(input, { target: { value: 'New New Folder 2' } });
    // and submits
    const form = page.root.shadowRoot!.querySelector('form')!;
    fireEvent.submit(form);
    // then the folder is created
    expect(os.files().createNewFolder).toHaveBeenCalledWith(container, 'New New Folder 2');
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
    const container = { fake: 'Container' } as unknown as LdpContainer;
    const page = await render(
      <pos-create-new-container-item type="folder" container={container}></pos-create-new-container-item>,
    );
    // and the page listens to error events
    const errorListener = vi.fn();
    page.root.addEventListener('pod-os:error', errorListener);
    // and a new folder fails to create
    const problem: HttpProblem = {
      status: 999,
      type: 'http',
      title: 'Something failed',
    };
    (os.files().createNewFolder as Mock).mockResolvedValue(errAsync(problem));
    // when the user enters a file name
    const input = page.root.shadowRoot!.querySelector('input')!;
    fireEvent.input(input, { target: { value: 'new-file.md' } });
    // and submits
    const form = page.root.shadowRoot!.querySelector('form')!;
    fireEvent.submit(form);
    // then an error is emitted
    await page.waitForChanges();
    expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ detail: problem }));
  });
});
