import { Component, h, Prop } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

/**
 * Allows sharing a resource with other apps, people, etc.
 */
@Component({
  tag: 'pos-share',
  styleUrl: 'pos-share.css',
  shadow: true,
})
export class PosShare {
  /**
   * URI of the resource to share.
   */
  @Prop() uri!: string;

  render() {
    return (
      <sl-dropdown>
        <button slot="trigger" aria-label="Share" part="button">
          <sl-icon name="share"></sl-icon>
        </button>
        <sl-menu>
          <sl-menu-item value="dashboard">
            <sl-icon slot="prefix" name="copy"></sl-icon>Copy URI
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item disabled>Open with...</sl-menu-item>
          <sl-menu-item value="logout">SolidOS Data Browser</sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    );
  }
}
