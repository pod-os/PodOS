import { AddressBook, Contact, ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Listen, Prop, State, Watch } from '@stencil/core';

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

  @State()
  selectedContact: Contact;

  async componentWillLoad() {
    await this.loadAddressBook();
  }

  @Listen('pod-os-contacts:contact-selected')
  async onContactSelected(event: CustomEvent<Contact>) {
    this.selectedContact = event.detail;
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
          {this.selectedContact ? (
            <pos-contacts-contact contactsModule={this.contactsModule} uri={this.selectedContact.uri}></pos-contacts-contact>
          ) : (
            <pos-contacts-contact-list contacts={this.addressBook.contacts} />
          )}
        </main>
      </Host>
    );
  }
}
