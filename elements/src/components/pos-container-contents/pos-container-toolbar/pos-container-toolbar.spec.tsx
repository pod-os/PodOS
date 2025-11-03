import { fireEvent, getAllByRole, getByRole, queryByRole, screen } from '@testing-library/dom';

jest.mock('./shoelace', () => {});
import { newSpecPage } from '@stencil/core/testing';

import { PosContainerToolbar } from './pos-container-toolbar';
import { userEvent } from '@testing-library/user-event';

describe('pos-container-toolbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PosContainerToolbar],
      html: `<pos-container-toolbar />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-container-toolbar aria-label="Container actions" role="toolbar">
        <sl-tooltip content="Create new file">
          <button aria-label="Create new file">
            <sl-icon name="file-earmark-plus"></sl-icon>
          </button>
        </sl-tooltip>
        <sl-tooltip content="Create new folder">
          <button aria-label="Create new folder">
            <sl-icon name="folder-plus"></sl-icon>
          </button>
        </sl-tooltip>
      </pos-container-toolbar>
    `);
  });

  it('emits event when new file button is clicked', async () => {
    const page = await newSpecPage({
      components: [PosContainerToolbar],
      html: `<pos-container-toolbar />`,
      supportsShadowDom: false,
    });
    const onCreateNewFile = jest.fn();
    page.root.addEventListener('pod-os:create-new-file', onCreateNewFile);
    screen.logTestingPlaygroundURL();
    const buttons = getAllByRole(page.root, 'button');
    const newFileButton = buttons[0];
    expect(newFileButton).toEqualAttribute('aria-label', 'Create new file');
    fireEvent.click(newFileButton);
    expect(onCreateNewFile).toHaveBeenCalled();
  });
  it('emits event when new folder button is clicked', async () => {
    const page = await newSpecPage({
      components: [PosContainerToolbar],
      html: `<pos-container-toolbar />`,
      supportsShadowDom: false,
    });
    const onCreateNewFolder = jest.fn();
    page.root.addEventListener('pod-os:create-new-folder', onCreateNewFolder);
    screen.logTestingPlaygroundURL();
    const buttons = getAllByRole(page.root, 'button');
    const newFolderButton = buttons[1];
    expect(newFolderButton).toEqualAttribute('aria-label', 'Create new folder');
    fireEvent.click(newFolderButton);
    expect(onCreateNewFolder).toHaveBeenCalled();
  });
});
