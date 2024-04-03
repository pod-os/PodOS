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
      template: () => <pos-contacts-address-book-page uri="https://pod.test/contacts#it" contactsModule={module}></pos-contacts-address-book-page>,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <pos-contacts-address-book-page>
        <main class='loading'>
            <pos-contacts-loading-spinner></pos-contacts-loading-spinner>
        </main>
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
        template: () => <pos-contacts-address-book-page uri="https://pod.test/contacts#it" contactsModule={module}></pos-contacts-address-book-page>,
        supportsShadowDom: false,
      });
    });

    it('the navigation shows the group list', async () => {
      const nav = getByRole(page.root, 'navigation');
      expect(nav.lastChild).toEqualHtml(`
        <pos-contacts-group-list></pos-contacts-group-list>
      `);
    });

    it('the navigation allows to create a new contact in the address book', async () => {
      const nav = getByRole(page.root, 'navigation');
      const createNewContact = nav.querySelector('pos-contacts-create-new-contact');
      expect(createNewContact).not.toBeNull();
      expect(createNewContact.getAttribute('addressBookUri')).toEqual('https://pod.test/contacts#it');
    });

    it('the main part shows the contact list', async () => {
      const main = getByRole(page.root, 'main');
      expect(main.firstChild).toEqualHtml(`
        <pos-contacts-contact-list></pos-contacts-contact-list>
      `);
    });
  });

  describe('when loading the address book failed', () => {
    it('the main part shows an error, login and retry', async () => {
      const module = {
        readAddressBook: jest.fn().mockRejectedValue({ error: 'fake error for testing' }),
      } as unknown as ContactsModule;
      const page = await newSpecPage({
        components: [AddressBookPage],
        template: () => <pos-contacts-address-book-page uri="https://pod.test/contacts#it" contactsModule={module}></pos-contacts-address-book-page>,
        supportsShadowDom: false,
      });
      await page.waitForChanges();
      const main = getByRole(page.root, 'main');
      expect(main).toEqualHtml(`
        <main class='error'>
          <h2>
            Loading the address book failed.
          </h2>
          <pos-login></pos-login>
          <p>
            You might need to log in and then
            <button class='retry'>
              <ion-icon name='reload-outline'></ion-icon>
              retry
            </button>
          </p>
          <pos-resource uri='https://pod.test/contacts#it'></pos-resource>
        </main>
      `);
    });
  });

  describe('event handling', () => {
    let page;
    beforeEach(async () => {
      const module = {
        readAddressBook: jest.fn().mockReturnValue({}),
      } as unknown as ContactsModule;
      page = await newSpecPage({
        components: [AddressBookPage],
        template: () => <pos-contacts-address-book-page uri="https://pod.test/contacts#it" contactsModule={module}></pos-contacts-address-book-page>,
        supportsShadowDom: false,
      });
    });

    describe('contact selection', () => {
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

    describe('group selection', () => {
      it('clears the selected contact and shows selected group', async () => {
        page.rootInstance.selectedContact = {
          uri: 'https://alice.test',
        };
        fireEvent(
          page.root,
          new CustomEvent('pod-os-contacts:group-selected', {
            detail: {
              uri: 'https://alice.test/group/1',
            },
          }),
        );
        await page.waitForChanges();
        expect(page.rootInstance.selectedContact).toEqual(null);
        expect(page.rootInstance.selectedGroup).toEqual({
          uri: 'https://alice.test/group/1',
        });
        const main = getByRole(page.root, 'main');
        expect(main.firstChild).toEqualHtml(`
        <pos-contacts-group-details uri='https://alice.test/group/1'></pos-contacts-group-details>
      `);
      });
    });

    describe('contact created', () => {
      it('shows the selected contact', async () => {
        page.rootInstance.selectedContact = null;
        page.rootInstance.addressBook = {
          contacts: [],
        };
        fireEvent(
          page.root,
          new CustomEvent('pod-os-contacts:contact-created', {
            detail: {
              uri: 'https://alice.test/contact/1',
              name: 'Bob',
            },
          }),
        );
        await page.waitForChanges();
        expect(page.rootInstance.selectedContact).toEqual({
          uri: 'https://alice.test/contact/1',
          name: 'Bob',
        });

        const main = getByRole(page.root, 'main');
        expect(main.firstChild).toEqualHtml(`
        <pos-contacts-contact-details uri='https://alice.test/contact/1'></pos-contacts-contact-details>
      `);
      });

      it('adds the created contact to the list', async () => {
        page.rootInstance.selectedContact = null;
        page.rootInstance.addressBook = {
          contacts: [
            {
              uri: 'https://alice.test/contact/1',
              name: 'Bob',
            },
          ],
        };
        fireEvent(
          page.root,
          new CustomEvent('pod-os-contacts:contact-created', {
            detail: {
              uri: 'https://alice.test/contact/2',
              name: 'Claire',
            },
          }),
        );
        await page.waitForChanges();
        expect(page.rootInstance.addressBook).toEqual({
          contacts: [
            {
              uri: 'https://alice.test/contact/1',
              name: 'Bob',
            },
            {
              uri: 'https://alice.test/contact/2',
              name: 'Claire',
            },
          ],
        });
      });
    });
  });
});
