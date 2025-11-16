import { Component, Host, h, Method } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

/**
 * Styled wrapper around native dialog element, with slots `title` and `content`
 */
@Component({
  tag: 'pos-dialog',
  styleUrl: 'pos-dialog.css',
  shadow: false, // shadow dom prevents the html dialog from working normally (autofocus, close on submit)
})
export class PosDialog {
  private dialog: HTMLDialogElement;

  @Method()
  async showModal() {
    this.dialog.showModal();
  }

  @Method()
  async close() {
    this.dialog.close();
  }

  render() {
    return (
      <Host>
        <dialog ref={el => (this.dialog = el as HTMLDialogElement)}>
          <header>
            <slot name="title" />
            <button tabindex={-1} id="close" title="Close" onClick={() => this.close()}>
              <sl-icon name="x"></sl-icon>
            </button>
          </header>
          <slot name="content" />
        </dialog>
      </Host>
    );
  }
}
