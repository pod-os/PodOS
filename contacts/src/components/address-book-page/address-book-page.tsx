import { AddressBook, Contact, ContactsModule, Group } from '@solid-data-modules/contacts-rdflib';
import { Component, Element, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { usePodOS } from '../../events/usePodOS';
// noinspection ES6PreferShortImport needs to be mocked
import { debounceTime } from '../../utils/debounceTime';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@Component({
  tag: 'pos-contacts-address-book-page',
  styleUrl: './address-book-page.css',
  shadow: true,
})
export class AddressBookPage {
  @Element() el: HTMLElement;

  @Prop()
  uri!: string;

  @Prop()
  contactsModule: ContactsModule;

  @State()
  addressBook: AddressBook;

  @State()
  selectedContact: Contact;

  @State()
  selectedGroup: Group;

  @State()
  error: any;

  @State()
  private menuOpen = false;

  private readonly disconnected$ = new Subject<void>();

  async componentWillLoad() {
    const os = await usePodOS(this.el);
    os.observeSession()
      .pipe(
        takeUntil(this.disconnected$),
        debounceTime(300), // make sure the session state has "settled" after redirect
        tap(() => {
          this.loadAddressBook();
        }),
      )
      .subscribe();
  }

  @Listen('pod-os-contacts:contact-selected')
  async onContactSelected(event: CustomEvent<Contact>) {
    this.selectedContact = event.detail;
  }

  @Listen('pod-os-contacts:group-selected')
  async onGroupSelected(event: CustomEvent<Group>) {
    this.selectedContact = null;
    this.selectedGroup = event.detail;
  }

  @Listen('pod-os-contacts:contact-created')
  async onContactCreated(event: CustomEvent<Contact>) {
    const contact = event.detail;
    this.addressBook.contacts.push(contact);
    this.selectedContact = contact;
  }

  @Watch('uri')
  async loadAddressBook() {
    try {
      this.addressBook = null;
      this.error = null;
      this.addressBook = await this.contactsModule.readAddressBook(this.uri);
    } catch (e) {
      console.log(e);
      this.error = e;
    }
  }

  render() {
    if (this.error) {
      return (
        <main class="error">
          <h2>Loading the address book failed.</h2>
          <pos-login></pos-login>
          <p>
            You might need to log in and then
            <button class="retry" onClick={() => this.retry()}>
              <sl-icon name="arrow-clockwise"></sl-icon>
              retry
            </button>
          </p>
        </main>
      );
    }
    if (!this.addressBook) {
      return (
        <main class="loading">
          <pos-contacts-loading-spinner />
        </main>
      );
    }
    return (
      <Host>
        <header>
          <button class="menu" aria-label="open side navigation" onClick={() => this.openMenu()}>
            <sl-icon aria-hidden="true" name="list"></sl-icon>
          </button>
          <hgroup>
            <h1>{this.addressBook.title}</h1>
          </hgroup>
          <pos-login></pos-login>
        </header>
        <nav class={this.menuOpen ? 'active' : ''}>
          <button class="menu" aria-label="close side navigation" onClick={() => this.closeMenu()}>
            <sl-icon aria-hidden="true" name="x"></sl-icon>
          </button>
          <pos-contacts-create-new-contact addressBookUri={this.uri} />
          <pos-contacts-group-list groups={this.addressBook.groups} />
        </nav>
        <main>
          {this.selectedContact ? (
            <pos-contacts-contact-details
              onPod-os-contacts:contact-closed={() => this.closeContact()}
              contactsModule={this.contactsModule}
              uri={this.selectedContact.uri}
            ></pos-contacts-contact-details>
          ) : this.selectedGroup ? (
            <pos-contacts-group-details uri={this.selectedGroup.uri} contactsModule={this.contactsModule} />
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

  private closeContact() {
    this.selectedContact = null;
  }

  private async retry() {
    await this.loadAddressBook();
  }
}
