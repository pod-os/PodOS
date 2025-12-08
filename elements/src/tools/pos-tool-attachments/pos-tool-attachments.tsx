import { Component, h } from '@stencil/core';

/**
 * A tool to manage attachments of a thing.
 */
@Component({
  tag: 'pos-tool-attachments',
})
export class PosToolAttachments {
  render() {
    return <pos-attachments></pos-attachments>;
  }
}
