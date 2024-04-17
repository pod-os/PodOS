import { AddressBookLists, ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, Event, h, Prop, State, Watch } from '@stencil/core';
import { PodOsModuleAware, PodOsModuleEventEmitter, subscribePodOsModule } from '../../events/PodOsModuleAware';

@Component({
  tag: 'pos-contacts-list-address-books',
  styleUrl: './list-address-books.css',
  shadow: true,
})
export class ListAddressBooks implements PodOsModuleAware<ContactsModule> {
  @Prop()
  webId!: string;

  @State()
  private contactsModule: ContactsModule;

  @Event({ eventName: 'pod-os:module' })
  subscribeModule: PodOsModuleEventEmitter<ContactsModule>;

  @State()
  private addressBookLists: AddressBookLists;

  componentWillLoad() {
    subscribePodOsModule('contacts', this);
  }

  receiveModule = (module: ContactsModule) => {
    this.contactsModule = module;
  };

  @Watch('contactsModule')
  async listAddressBooks() {
    this.addressBookLists = await this.contactsModule.listAddressBooks(this.webId);
  }

  render() {
    if (!this.addressBookLists) {
      return <div>Loading...</div>;
    }
    const allUris = [...this.addressBookLists.privateUris, ...this.addressBookLists.publicUris];
    if (allUris.length == 0) {
      return <div>Sorry, no address books could be found in your pod.</div>;
    }
    return (
      <ul>
        {allUris.map(uri => (
          <li>
            <pos-rich-link uri={uri}></pos-rich-link>
          </li>
        ))}
      </ul>
    );
  }
}
