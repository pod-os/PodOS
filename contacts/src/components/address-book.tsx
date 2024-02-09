import { AddressBook } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-address-book',
})
export class PosContactsAddressBook {
  @Prop()
  addressBook: AddressBook;
  render() {
    return (
      <Host>
        <h1>{this.addressBook.title}</h1>
        <ul>
          {this.addressBook.contacts.map(it => (
            <li>{it.name}</li>
          ))}
        </ul>
      </Host>
    );
  }
}
