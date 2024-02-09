import { AddressBook, ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, State, h, Event } from '@stencil/core';

import { PodOS } from '@pod-os/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-contacts',
})
export class Contacts implements PodOsAware {
  @State() contactsModule: ContactsModule;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  @State()
  private addressBook: AddressBook;

  componentWillLoad() {
    subscribePodOs(this);
  }

  receivePodOs = async (os: PodOS) => {
    this.contactsModule = await os.loadContactsModule();
    this.addressBook = await this.contactsModule.readAddressBook('http://localhost:3000/alice/public-contacts/index.ttl#this');
  };

  render() {
    return this.addressBook ? <pos-contacts-address-book addressBook={this.addressBook} /> : <div>Loading...</div>;
  }
}
