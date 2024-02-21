import { ContactsModule, FullContact } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pos-contacts-contact-details',
  styleUrl: './contact-details.css',
})
export class ContactDetails {
  @Prop()
  uri: string;

  @Prop()
  contactsModule: ContactsModule;

  @State()
  private contact: FullContact;

  async componentWillLoad() {
    await this.loadContact();
  }

  @Watch('uri')
  async loadContact() {
    this.contact = await this.contactsModule.readContact(this.uri);
  }
  render() {
    if (!this.contact) {
      return <div>Loading contact...</div>;
    }

    return (
      <Host>
        <h2>{this.contact.name}</h2>
        <pos-contacts-phone-numbers />
        <pos-contacts-email-addresses emailAddresses={this.contact.emails} />
      </Host>
    );
  }
}
