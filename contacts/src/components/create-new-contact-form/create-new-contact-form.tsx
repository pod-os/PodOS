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
  contactsModule: ContactsModule;

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
        name: 'TODO',
        email: 'todo@test.test',
        phoneNumber: '0123',
      },
      addressBookUri: this.addressBookUri,
    });
  }

  render() {
    return (
      <form method="dialog" onSubmit={() => this.handleSubmit()}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required={true} />
        <label htmlFor="phoneNumber">Phone</label>
        <input id="phoneNumber" name="phoneNumber" type="tel" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <input type="submit" id="create" value="Save"></input>
      </form>
    );
  }
}
