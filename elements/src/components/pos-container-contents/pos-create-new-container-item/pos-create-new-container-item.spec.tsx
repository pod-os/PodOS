import { PodOS } from '@pod-os/core';

jest.mock('../../events/usePodOS');

import { newSpecPage } from '@stencil/core/testing';
import { PosCreateNewContainerItem } from './pos-create-new-container-item';
import { usePodOS } from '../../events/usePodOS';
import { when } from 'jest-when';

import { mockPodOS } from '../../../test/mockPodOS';
import { fireEvent } from '@testing-library/dom';

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
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="file"/>`,
      supportsShadowDom: false,
    });
    page.rootInstance.container = { fake: 'Container' };
    const input = page.root.querySelector('input');
    fireEvent.input(input, { target: { value: 'new-file.md' } });
    const form = page.root.querySelector('form');
    fireEvent.submit(form);
    expect(os.files().createNewFile).toHaveBeenCalledWith(page.rootInstance.container, 'new-file.md');
  });

  it('creates a new folder in the container', async () => {
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="folder"/>`,
      supportsShadowDom: false,
    });
    page.rootInstance.container = { fake: 'Container' };
    const input = page.root.querySelector('input');
    fireEvent.input(input, { target: { value: 'New New Folder 2' } });
    const form = page.root.querySelector('form');
    fireEvent.submit(form);
    expect(os.files().createNewFolder).toHaveBeenCalledWith(page.rootInstance.container, 'New New Folder 2');
  });
});
