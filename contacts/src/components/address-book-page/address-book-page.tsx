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

  @State()
  private menuOpen = false;

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
          <button class="menu" onClick={() => this.openMenu()}>
            <ion-icon name="menu-outline"></ion-icon>
          </button>
          <hgroup>
            <h1>{this.addressBook.title}</h1>
          </hgroup>
          <pos-login></pos-login>
        </header>
        <nav class={this.menuOpen ? 'active' : ''}>
          <button class="menu" onClick={() => this.closeMenu()}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
          <pos-contacts-group-list groups={this.addressBook.groups} />
        </nav>
        <main>
          {this.selectedContact ? (
            <pos-contacts-contact-details contactsModule={this.contactsModule} uri={this.selectedContact.uri}></pos-contacts-contact-details>
          ) : (
            <pos-contacts-contact-list contacts={this.addressBook.contacts} />
          )}
        </main>
      </Host>
    );
  }

  private openMenu() {
    this.menuOpen = true;
  }

  private closeMenu() {
    this.menuOpen = false;
  }
}
