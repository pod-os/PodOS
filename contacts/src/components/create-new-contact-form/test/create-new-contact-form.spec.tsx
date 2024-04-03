import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CreateNewContactForm } from '../create-new-contact-form';

describe('create new contact form', () => {
  let page;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [CreateNewContactForm],
      template: () => <pos-contacts-create-new-contact-form addressBookUri="https://pod.test/contacts#this"></pos-contacts-create-new-contact-form>,
      supportsShadowDom: false,
    });
  });

  it('shows a form to enter contact data', () => {
    expect(page.root).toEqualHtml(`<pos-contacts-create-new-contact-form>
  <form method='dialog'>
    <label htmlfor='name'>
      Name
    </label>
    <input id='name' name='name' required='' type='text'>
    <label htmlfor='phoneNumber'>
      Phone
    </label>
    <input id='phoneNumber' name='phoneNumber' type='tel'>
    <label htmlfor='email'>
      Email
    </label>
    <input id='email' name='email' type='email'>
    <input id='create' type='submit' value='Save'>
  </form>
</pos-contacts-create-new-contact-form>`);
  });

  it('creates a new contact when submitted', () => {
    const module = {
      createNewContact: jest.fn() as unknown,
    } as ContactsModule;
    page.rootInstance.receiveModule(module);
    page.rootInstance.submit();
    expect(module.createNewContact).toHaveBeenCalledWith({
      contact: {
        name: 'TODO',
        email: 'todo@test.test',
        phoneNumber: '0123',
      },
      addressBookUri: 'https://pod.test/contacts#this',
    });
  });
});
