import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-add-new-thing',
  styleUrl: 'pos-add-new-thing.css',
  shadow: true,
})
export class PosAddNewThing {
  @Prop() referenceUri!: string;

  private dialog: HTMLPosDialogElement;

  openDialog() {
    this.dialog.showModal();
  }

  render() {
    return (
      <Host>
        <button id="new" title="Add a new thing" onClick={() => this.openDialog()}>
          <ion-icon name="add-circle-outline"></ion-icon>
        </button>
        <pos-dialog ref={el => (this.dialog = el as HTMLPosDialogElement)}>
          <span slot="title">Add a new thing</span>
          <pos-new-thing-form slot="content" referenceUri={this.referenceUri} />
        </pos-dialog>
      </Host>
    );
  }
}
