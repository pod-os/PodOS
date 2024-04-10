import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-create-new-contact',
  styleUrl: 'create-new-contact.css',
  shadow: true,
})
export class CreateNewContact {
  private dialog: HTMLPosDialogElement;

  @Prop()
  addressBookUri!: string;

  render() {
    return (
      <Host>
        <button class="create" onClick={() => this.dialog.showModal()}>
          <ion-icon name="person-add"></ion-icon>
          Create contact
        </button>
        <pos-dialog ref={el => (this.dialog = el as HTMLPosDialogElement)}>
          <h2 slot="title">Create new contact</h2>
          <pos-contacts-create-new-contact-form addressBookUri={this.addressBookUri} slot="content" />
        </pos-dialog>
      </Host>
    );
  }
}
