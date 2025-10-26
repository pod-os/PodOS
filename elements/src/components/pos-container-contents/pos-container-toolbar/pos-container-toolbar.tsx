import { Component, h, Host } from '@stencil/core';

import './shoelace';

@Component({
  shadow: true,
  tag: 'pos-container-toolbar',
  styleUrl: 'pos-container-toolbar.css',
})
export class PosContainerToolbar {
  render() {
    return (
      <Host>
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
      </Host>
    );
  }
}
