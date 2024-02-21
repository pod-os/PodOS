import { ContactsModule, FullContact } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';

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

  @Event({ eventName: 'pod-os-contacts:contact-closed' })
  closeContact: EventEmitter<void>;

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
        <button aria-label="Back to address book" onClick={() => this.closeContact.emit()}>
          back
        </button>
        <h2>{this.contact.name}</h2>
        <pos-contacts-phone-numbers phoneNumbers={this.contact.phoneNumbers} />
        <pos-contacts-email-addresses emailAddresses={this.contact.emails} />
      </Host>
    );
  }
}
