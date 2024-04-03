import { ContactsModule, NewContact } from '@solid-data-modules/contacts-rdflib';
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { PodOsModuleAware, PodOsModuleEventEmitter, subscribePodOsModule } from '../../events/PodOsModuleAware';

@Component({
  tag: 'pos-contacts-create-new-contact-form',
  styleUrl: 'create-new-contact-form.css',
  shadow: {
    delegatesFocus: true,
  },
})
export class CreateNewContactForm implements PodOsModuleAware<ContactsModule> {
  @State()
  private contactsModule: ContactsModule;

  @State()
  private newContact: NewContact = {
    name: '',
  };

  @Prop()
  addressBookUri!: string;
  @Event({ eventName: 'pod-os:module' })
  subscribeModule: PodOsModuleEventEmitter<ContactsModule>;

  @Event({ eventName: 'pod-os-contacts:contact-created' })
  contactCreated: EventEmitter<NewContact>;

  @Event({ eventName: 'pod-os:error' }) errorEmitter: EventEmitter;

  componentWillLoad() {
    subscribePodOsModule('contacts', this);
  }

  receiveModule = (module: ContactsModule) => {
    this.contactsModule = module;
  };

  async handleSubmit() {
    try {
      await this.contactsModule.createNewContact({
        contact: this.newContact,
        addressBookUri: this.addressBookUri,
      });
      this.contactCreated.emit(this.newContact);
    } catch (e) {
      this.errorEmitter.emit(e);
    }
  }

  handleNameChanged(event) {
    this.newContact.name = event.target.value;
  }

  handlePhoneNumberChanged(event) {
    this.newContact.phoneNumber = event.target.value;
  }

  private handleEmailAddressChanged(event) {
    this.newContact.email = event.target.value;
  }

  render() {
    return (
      <form method="dialog" onSubmit={() => this.handleSubmit()}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" onInput={e => this.handleNameChanged(e)} required={true} />
        <label htmlFor="phoneNumber">Phone</label>
        <input id="phoneNumber" name="phoneNumber" type="tel" onInput={e => this.handlePhoneNumberChanged(e)} />
        <label htmlFor="emailAddress">Email</label>
        <input id="emailAddress" name="emailAddress" type="email" onInput={e => this.handleEmailAddressChanged(e)} />
        <input type="submit" id="create" value="Save"></input>
      </form>
    );
  }
}
