import { ContactsModule, FullContact } from '@solid-data-modules/contacts-rdflib';
import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { useContactsModule } from '../events/useContactsModule';

@Component({
  tag: 'pos-contacts-contact',
})
export class Contact {
  @Prop()
  uri: string;

  @Element() el: HTMLElement;

  @State()
  contact: FullContact;

  @State()
  contactsModule!: ContactsModule;

  async componentWillLoad() {
    this.contactsModule = await useContactsModule(this.el);
    await this.loadContact();
  }

  @Watch('uri')
  async loadContact() {
    this.contact = await this.contactsModule.readContact(this.uri);
  }
  render() {
    return (
      <Host>
        <h2>{this.contact.name}</h2>
        <dl>
          <dt>E-Mail</dt>
          <dd>
            <ul>
              {this.contact.emails.map(it => (
                <li>{it.value}</li>
              ))}
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>Phone</dt>
          <dd>
            <ul>
              {this.contact.phoneNumbers.map(it => (
                <li>{it.value}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </Host>
    );
  }
}
