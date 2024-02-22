import { ContactsModule, FullContact } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'pos-contacts-contact-details',
  styleUrl: './contact-details.css',
  shadow: true,
})
export class ContactDetails {
  @Prop()
  uri!: string;

  @Prop()
  contactsModule!: ContactsModule;

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
        <header>
          <button class="back" aria-label="Back to address book" onClick={() => this.closeContact.emit()}>
            <ion-icon aria-hidden="true" name="arrow-back-outline"></ion-icon>
          </button>
          <div class="overview">
            <ion-icon size="large" name="person-circle-outline"></ion-icon>
            <h2>{this.contact.name}</h2>
          </div>
        </header>
        <section>
          <pos-contacts-phone-numbers phoneNumbers={this.contact.phoneNumbers} />
          <pos-contacts-email-addresses emailAddresses={this.contact.emails} />
        </section>
      </Host>
    );
  }
}
