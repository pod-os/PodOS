import { ContactsModule, FullContact } from '@solid-data-modules/contacts-rdflib';

// noinspection ES6UnusedImports
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { getByRole } from '@testing-library/dom';
import { when } from 'jest-when';
import { ContactDetails } from './contact-details';

describe('contact details', () => {
  it('shows loading indicator while there is no contact', async () => {
    const module: ContactsModule = {
      readContact: jest.fn(),
    } as unknown as ContactsModule;
    const page = await newSpecPage({
      components: [ContactDetails],
      template: () => <pos-contacts-contact-details uri="https://contact.example" contactsModule={module}></pos-contacts-contact-details>,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <pos-contacts-contact-details>
        <div>
          Loading contact...
        </div>
      </pos-contacts-address-book-page>
    `);
  });

  describe('loaded contact', () => {
    let page;
    beforeEach(async () => {
      const module: ContactsModule = {
        readContact: jest.fn(),
      } as unknown as ContactsModule;
      const contact: FullContact = {
        emails: [],
        name: 'Alice',
        phoneNumbers: [],
        uri: 'https://contact.example/alice',
      };
      when(module.readContact).calledWith('https://contact.example/alice').mockResolvedValue(contact);
      page = await newSpecPage({
        components: [ContactDetails],
        template: () => <pos-contacts-contact-details uri="https://contact.example/alice" contactsModule={module}></pos-contacts-contact-details>,
        supportsShadowDom: false,
      });
    });

    it('shows the name of the loaded contact', async () => {
      const heading = getByRole(page.root, 'heading');
      expect(heading).toEqualHtml('<h2>Alice</h2>');
    });

    it('shows the phone numbers', () => {
      const phoneNumbers = page.root.querySelector('pos-contacts-phone-numbers');
      expect(phoneNumbers).not.toBeNull();
    });

    it('shows the e-mail addresses', () => {
      const emailAddresses = page.root.querySelector('pos-contacts-email-addresses');
      expect(emailAddresses).not.toBeNull();
    });
  });
});
