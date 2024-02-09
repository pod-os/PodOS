import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-contact',
})
export class Contact {
  @Prop()
  uri: string;

  @Prop()
  contactsModule: ContactsModule;
  render() {
    return <h2>contact {this.uri}</h2>;
  }
}
