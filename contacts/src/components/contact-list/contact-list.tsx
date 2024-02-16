import { Contact } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-contact-list',
  styleUrl: './contact-list.css',
  shadow: true,
})
export class ContactList {
  @Prop()
  contacts: Contact[];

  render() {
    return (
      <ul>
        {this.contacts.map(it => (
          <li>
            <a href={it.uri}>{it.name || it.uri}</a>
          </li>
        ))}
      </ul>
    );
  }
}
