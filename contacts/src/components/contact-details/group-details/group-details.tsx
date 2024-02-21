import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-group-details',
})
export class GroupDetails {
  @Prop()
  uri!: string;

  @Prop()
  contactsModule!: ContactsModule;
  render() {
    return <Host>{this.uri}</Host>;
  }
}
