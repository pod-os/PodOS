import { AddressBookLists, ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { when } from 'jest-when';
import { ListAddressBooks } from '../list-address-books';

describe('list address books', () => {
  let page;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [ListAddressBooks],
      template: () => <pos-contacts-list-address-books webId="https://alice.test/profile/card#me" />,
      supportsShadowDom: false,
    });
  });

  it('shows loading indicator initially', () => {
    expect(page.root).toEqualHtml(`
    <pos-contacts-list-address-books>
      <div>Loading...</div>
    </pos-contacts-list-address-books>`);
  });

  it('indicates that now address books have been found', async () => {
    const module = {
      listAddressBooks: jest.fn() as unknown,
    } as ContactsModule;

    const lists: AddressBookLists = {
      publicUris: [],
      privateUris: [],
    };

    when(module.listAddressBooks).calledWith('https://alice.test/profile/card#me').mockResolvedValue(lists);

    page.rootInstance.receiveModule(module);
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-contacts-list-address-books>
      <div>Sorry, no address books could be found in your pod.</div>
    </pos-contacts-list-address-books>`);
  });

  it('lists a single private address book', async () => {
    const module = {
      listAddressBooks: jest.fn() as unknown,
    } as ContactsModule;

    const lists: AddressBookLists = {
      publicUris: [],
      privateUris: ['https://alice.test/private/contacts/1'],
    };

    when(module.listAddressBooks).calledWith('https://alice.test/profile/card#me').mockResolvedValue(lists);

    page.rootInstance.receiveModule(module);
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-contacts-list-address-books>
    <ul>
      <a href="https://alice.test/private/contacts/1">
        <li>
          <pos-resource uri="https://alice.test/private/contacts/1">
            <div class="label">
              <sl-icon name="book"></sl-icon>
              <pos-label></pos-label>
            </div>
          </pos-resource>
        </li>
      </a>
    </ul>
  </pos-contacts-list-address-books>`);
  });

  it('lists a single public address book', async () => {
    const module = {
      listAddressBooks: jest.fn() as unknown,
    } as ContactsModule;

    const lists: AddressBookLists = {
      publicUris: ['https://alice.test/public/contacts/1'],
      privateUris: [],
    };

    when(module.listAddressBooks).calledWith('https://alice.test/profile/card#me').mockResolvedValue(lists);

    page.rootInstance.receiveModule(module);
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-contacts-list-address-books>
    <ul>
      <a href="https://alice.test/public/contacts/1">
        <li>
          <pos-resource uri="https://alice.test/public/contacts/1">
            <div class="label">
              <sl-icon name="book"></sl-icon>
              <pos-label></pos-label>
            </div>
          </pos-resource>
        </li>
      </a>
    </ul>
    </pos-contacts-list-address-books>`);
  });

  it('lists all address books', async () => {
    const module = {
      listAddressBooks: jest.fn() as unknown,
    } as ContactsModule;

    const lists: AddressBookLists = {
      publicUris: ['https://alice.test/public/contacts/1'],
      privateUris: ['https://alice.test/private/contacts/1', 'https://alice.test/private/contacts/2'],
    };

    when(module.listAddressBooks).calledWith('https://alice.test/profile/card#me').mockResolvedValue(lists);

    page.rootInstance.receiveModule(module);
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-contacts-list-address-books>
    <ul>
      <a href="https://alice.test/private/contacts/1">
        <li>
          <pos-resource uri="https://alice.test/private/contacts/1">
            <div class="label">
              <sl-icon name="book"></sl-icon>
              <pos-label></pos-label>
            </div>
          </pos-resource>
        </li>
      </a>
      <a href="https://alice.test/private/contacts/2">
        <li>
          <pos-resource uri="https://alice.test/private/contacts/2">
            <div class="label">
              <sl-icon name="book"></sl-icon>
              <pos-label></pos-label>
            </div>
          </pos-resource>
        </li>
      </a>
      <a href="https://alice.test/public/contacts/1">
        <li>
          <pos-resource uri="https://alice.test/public/contacts/1">
            <div class="label">
              <sl-icon name="book"></sl-icon>
              <pos-label></pos-label>
            </div>
          </pos-resource>
        </li>
      </a>
    </ul>
  </pos-contacts-list-address-books>`);
  });
});
