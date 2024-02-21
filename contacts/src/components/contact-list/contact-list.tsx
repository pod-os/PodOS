import { Contact } from '@solid-data-modules/contacts-rdflib';
import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-contact-list',
  styleUrl: './contact-list.css',
  shadow: true,
})
export class ContactList {
  @Prop()
  contacts!: Contact[];

  @Event({ eventName: 'pod-os-contacts:contact-selected' }) contactSelected: EventEmitter<Contact>;

  render() {
    return (
      <ul>
        {this.contacts.map(it => (
          <li>
            <a
              onClick={e => {
                e.preventDefault();
                this.contactSelected.emit(it);
              }}
              href={it.uri}
            >
              {it.name || it.uri}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}
