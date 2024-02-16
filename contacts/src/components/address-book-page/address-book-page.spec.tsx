import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { AddressBookPage } from './address-book-page';

import { getByRole } from '@testing-library/dom';

describe('address-book-page', () => {
  it('shows loading indicator while there is no address book', async () => {
    const module = {
      readAddressBook: jest.fn(),
    };
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
      };
      page = await newSpecPage({
        components: [AddressBookPage],
        template: () => <pos-contacts-address-book-page contactsModule={module}></pos-contacts-address-book-page>,
        supportsShadowDom: false,
      });
    });

    it('the navigation shows the group list', async () => {
      const nav = getByRole(page.root, 'navigation');
      expect(nav.firstChild).toEqualHtml(`
        <pos-contacts-group-list></pos-contacts-group-list>
      `);
    });

    it('the main part shows the contact list', async () => {
      const nav = getByRole(page.root, 'main');
      expect(nav.firstChild).toEqualHtml(`
        <pos-contacts-contact-list></pos-contacts-contact-list>
      `);
    });
  });
});
