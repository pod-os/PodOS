jest.mock('./shoelace', () => {});
import { newSpecPage } from '@stencil/core/testing';

import { PosContainerToolbar } from './pos-container-toolbar';

describe('pos-container-toolbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PosContainerToolbar],
      html: `<pos-container-toolbar />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-container-toolbar>
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
});
