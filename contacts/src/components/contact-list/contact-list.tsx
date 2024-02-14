import { Contact } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'pos-contacts-contact-list',
})
export class ContactList {
  @Prop()
  contacts: Contact[];

  render() {
    return (
      <ul>
        {this.contacts.map(it => (
          <li>
            <a {...href(`/contact?uri=${encodeURIComponent(it.uri)}`)}>{it.name || it.uri}</a>
          </li>
        ))}
      </ul>
    );
  }
}
