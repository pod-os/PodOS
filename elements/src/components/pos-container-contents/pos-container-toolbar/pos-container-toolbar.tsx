import { Component, Event, EventEmitter, h, Host } from '@stencil/core';

import './shoelace';

@Component({
  shadow: true,
  tag: 'pos-container-toolbar',
  styleUrl: 'pos-container-toolbar.css',
})
export class PosContainerToolbar {
  @Event({ eventName: 'pod-os:create-new-file' })
  createNewFile: EventEmitter<void>;

  @Event({ eventName: 'pod-os:create-new-folder' })
  createNewFolder: EventEmitter<void>;

  render() {
    return (
      <Host>
        <sl-tooltip content="Create new file">
          <button aria-label="Create new file" onClick={() => this.createNewFile.emit()}>
            <sl-icon name="file-earmark-plus"></sl-icon>
          </button>
        </sl-tooltip>
        <sl-tooltip content="Create new folder">
          <button aria-label="Create new folder" onClick={() => this.createNewFolder.emit()}>
            <sl-icon name="folder-plus"></sl-icon>
          </button>
        </sl-tooltip>
      </Host>
    );
  }
}
