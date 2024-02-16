import { AddressBook, ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pos-contacts-address-book-page',
  styleUrl: 'address-book-page.css',
  shadow: true,
})
export class AddressBookPage {
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
        <header>
          <h1>{this.addressBook.title}</h1>
          <pos-login></pos-login>
        </header>
        <nav>
          <pos-contacts-group-list groups={this.addressBook.groups} />
        </nav>
        <main>
          <pos-contacts-contact-list contacts={this.addressBook.contacts} />
        </main>
      </Host>
    );
  }
}
