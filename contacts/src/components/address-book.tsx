import { AddressBook, ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'pos-contacts-address-book',
})
export class PosContactsAddressBook {
  @Prop()
  uri: string;

  @Prop()
  contactsModule: ContactsModule;

  @State()
  addressBook: AddressBook;

  async componentWillLoad() {
    await this.loadAddressBook();
  }

  @Watch('uri')
  async loadAddressBook() {
    this.addressBook = await this.contactsModule.readAddressBook(this.uri);
  }

  render() {
    if (!this.addressBook) {
      return <div>Loading address book...</div>;
    }
    return (
      <Host>
        <h2>{this.addressBook.title}</h2>
        <p>
          <a href={this.addressBook.uri}>{this.addressBook.uri}</a>
        </p>
        <h3>Contacts</h3>
        <ul>
          {this.addressBook.contacts.map(it => (
            <li>
              <a {...href(`/contact?uri=${encodeURIComponent(it.uri)}`)}>{it.name}</a>
            </li>
          ))}
        </ul>
        <h3>Groups</h3>
        <ul>
          {this.addressBook.groups.map(it => (
            <li>
              <a {...href(`/group?uri=${encodeURIComponent(it.uri)}`)}>{it.name}</a>
            </li>
          ))}
        </ul>
      </Host>
    );
  }
}
