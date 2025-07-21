import { Component, Host, h, Method } from '@stencil/core';

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
  showModal() {
    this.dialog.showModal();
  }

  @Method()
  close() {
    this.dialog.close();
  }

  render() {
    return (
      <Host>
        <dialog ref={el => (this.dialog = el)}>
          <header>
            <slot name="title" />
            <button tabindex={-1} id="close" title="Close" onClick={() => this.close()}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </header>
          <slot name="content" />
        </dialog>
      </Host>
    );
  }
}
