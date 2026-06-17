import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';

import { fireEvent, screen } from '@testing-library/dom';
import './pos-container-toolbar';
import { withinShadow } from '../../../test/withinShadow';

vi.mock('./shoelace', () => ({}));

describe('pos-container-toolbar', () => {
  it('renders', async () => {
    const page = await render(<pos-container-toolbar></pos-container-toolbar>);

    expect(page.root.shadowRoot).toEqualHtml(`
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
    `);
  });

  it('emits event when new file button is clicked', async () => {
    const page = await render(<pos-container-toolbar></pos-container-toolbar>);
    const onCreateNewFile = vi.fn();
    page.root.addEventListener('pod-os:create-new-file', onCreateNewFile);
    screen.logTestingPlaygroundURL();
    const buttons = withinShadow(page).getAllByRole('button');
    const newFileButton = buttons[0];
    expect(newFileButton).toEqualAttribute('aria-label', 'Create new file');
    fireEvent.click(newFileButton);
    expect(onCreateNewFile).toHaveBeenCalled();
  });
  it('emits event when new folder button is clicked', async () => {
    const page = await render(<pos-container-toolbar></pos-container-toolbar>);
    const onCreateNewFolder = vi.fn();
    page.root.addEventListener('pod-os:create-new-folder', onCreateNewFolder);
    screen.logTestingPlaygroundURL();
    const buttons = withinShadow(page).getAllByRole('button');
    const newFolderButton = buttons[1];
    expect(newFolderButton).toEqualAttribute('aria-label', 'Create new folder');
    fireEvent.click(newFolderButton);
    expect(onCreateNewFolder).toHaveBeenCalled();
  });
});
