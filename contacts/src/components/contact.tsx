import { ContactsModule, FullContact } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pos-contacts-contact',
})
export class Contact {
  @Prop()
  uri: string;

  @Prop()
  contactsModule: ContactsModule;

  @State()
  contact: FullContact;

  componentWillLoad() {
    this.loadContact();
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
