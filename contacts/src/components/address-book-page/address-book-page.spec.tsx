import { ContactsModule } from '@solid-data-modules/contacts-rdflib';

// noinspection ES6UnusedImports
import { h } from '@stencil/core';

import { newSpecPage } from '@stencil/core/testing';

import { fireEvent, getByRole } from '@testing-library/dom';
import { AddressBookPage } from './address-book-page';

describe('address-book-page', () => {
  it('shows loading indicator while there is no address book', async () => {
    const module = {
      readAddressBook: jest.fn(),
    } as unknown as ContactsModule;
    const page = await newSpecPage({
      components: [AddressBookPage],
      template: () => <pos-contacts-address-book-page contactsModule={module}></pos-contacts-address-book-page>,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <pos-contacts-address-book-page>
        <div>
          Loading address book...
        </div>
      </pos-contacts-address-book-page>
    `);
  });

  describe('after loading an address book', () => {
    let page;
    beforeEach(async () => {
      const module = {
        readAddressBook: jest.fn().mockReturnValue({}),
      } as unknown as ContactsModule;
      page = await newSpecPage({
        components: [AddressBookPage],
        template: () => <pos-contacts-address-book-page contactsModule={module}></pos-contacts-address-book-page>,
        supportsShadowDom: false,
      });
    });

    it('the navigation shows the group list', async () => {
      const nav = getByRole(page.root, 'navigation');
      expect(nav.lastChild).toEqualHtml(`
        <pos-contacts-group-list></pos-contacts-group-list>
      `);
    });

    it('the main part shows the contact list', async () => {
      const main = getByRole(page.root, 'main');
      expect(main.firstChild).toEqualHtml(`
        <pos-contacts-contact-list></pos-contacts-contact-list>
      `);
    });
  });

  describe('contact selection', () => {
    let page;
    beforeEach(async () => {
      const module = {
        readAddressBook: jest.fn().mockReturnValue({}),
      } as unknown as ContactsModule;
      page = await newSpecPage({
        components: [AddressBookPage],
        template: () => <pos-contacts-address-book-page contactsModule={module}></pos-contacts-address-book-page>,
        supportsShadowDom: false,
      });
    });

    it('shows a selected contact', async () => {
      fireEvent(
        page.root,
        new CustomEvent('pod-os-contacts:contact-selected', {
          detail: {
            uri: 'https://alice.test',
          },
        }),
      );
      await page.waitForChanges();
      expect(page.rootInstance.selectedContact).toEqual({
        uri: 'https://alice.test',
      });
      const main = getByRole(page.root, 'main');
      expect(main.firstChild).toEqualHtml(`
        <pos-contacts-contact-details uri='https://alice.test'></pos-contacts-contact-details>
      `);
    });

    it('removes selected contact when closed', async () => {
      page.rootInstance.selectedContact = {
        uri: 'https://alice.test',
      };

      await page.waitForChanges();
      const main = getByRole(page.root, 'main');
      expect(main.firstChild).toEqualHtml(`
        <pos-contacts-contact-details uri='https://alice.test'></pos-contacts-contact-details>
      `);

      fireEvent(main.firstChild, new CustomEvent('pod-os-contacts:contact-closed'));

      expect(page.rootInstance.selectedContact).toEqual(null);
    });
  });
});
