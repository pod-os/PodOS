import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
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
    <label htmlfor='emailAddress'>
      Email
    </label>
    <input id='emailAddress' name='emailAddress' type='email'>
    <input id='create' type='submit' value='Save'>
  </form>
</pos-contacts-create-new-contact-form>`);
  });

  it('creates a new contact when submitted', async () => {
    const module = {
      createNewContact: jest.fn() as unknown,
    } as ContactsModule;

    page.rootInstance.receiveModule(module);

    const nameField = page.root.querySelector('input[name="name"]');
    fireEvent.input(nameField, { target: { value: 'Bob' } });

    const phoneNumberField = page.root.querySelector('input[name="phoneNumber"]');
    fireEvent.input(phoneNumberField, { target: { value: '12345' } });

    const emailField = page.root.querySelector('input[name="emailAddress"]');
    fireEvent.input(emailField, { target: { value: 'bob@mail.test' } });

    const form: HTMLFormElement = page.root.querySelector('form');
    fireEvent.submit(form);

    await page.waitForChanges();
    expect(module.createNewContact).toHaveBeenCalledWith({
      contact: {
        name: 'Bob',
        email: 'bob@mail.test',
        phoneNumber: '12345',
      },
      addressBookUri: 'https://pod.test/contacts#this',
    });
  });
});
