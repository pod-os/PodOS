import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, Event, h, Prop, State } from '@stencil/core';
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
  private name: string = '';

  @State()
  private phoneNumber: string | null = null;

  @State()
  private emailAddress: string | null = null;

  @Prop()
  addressBookUri!: string;
  @Event({ eventName: 'pod-os:module' })
  subscribeModule: PodOsModuleEventEmitter<ContactsModule>;

  componentWillLoad() {
    subscribePodOsModule('contacts', this);
  }

  receiveModule = (module: ContactsModule) => {
    this.contactsModule = module;
  };

  handleSubmit() {
    this.contactsModule.createNewContact({
      contact: {
        name: this.name,
        email: this.emailAddress,
        phoneNumber: this.phoneNumber,
      },
      addressBookUri: this.addressBookUri,
    });
  }

  handleNameChanged(event) {
    this.name = event.target.value;
  }

  handlePhoneNumberChanged(event) {
    this.phoneNumber = event.target.value;
  }

  private handleEmailAddressChanged(event) {
    this.emailAddress = event.target.value;
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
