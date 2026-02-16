import { Component, h, Prop } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

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
      <button part="button">
        <sl-icon name="share"></sl-icon>
      </button>
    );
  }
}
