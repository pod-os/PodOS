import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-add-new-thing',
  styleUrl: 'pos-add-new-thing.css',
  shadow: true,
})
export class PosAddNewThing {
  @Prop() referenceUri!: string;

  private dialog: HTMLDialogElement;

  openDialog() {
    this.dialog.showModal();
  }

  closeDialog() {
    this.dialog.close();
  }
  render() {
    return (
      <Host>
        <button id="new" title="Add a new thing" onClick={() => this.openDialog()}>
          <ion-icon name="add-circle-outline"></ion-icon>
        </button>
        <dialog ref={el => (this.dialog = el as HTMLDialogElement)}>
          <header>
            <span id="title">Add a new thing</span>
            <button id="close" title="Close" onClick={() => this.closeDialog()}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </header>
          <pos-new-thing-form referenceUri={this.referenceUri} />
        </dialog>
      </Host>
    );
  }
}
