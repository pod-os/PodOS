import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-group',
})
export class Group {
  @Prop()
  uri: string;

  @Prop()
  contactsModule: ContactsModule;
  render() {
    return <h2>group {this.uri}</h2>;
  }
}
