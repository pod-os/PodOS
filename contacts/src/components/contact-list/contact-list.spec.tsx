import { h } from '@stencil/core';

import { newSpecPage } from '@stencil/core/testing';

import { getByRole } from '@testing-library/dom';
import { ContactList } from './contact-list';

describe('contact-list', () => {
  it('renders an empty list without contacts', async () => {
    const page = await newSpecPage({
      components: [ContactList],
      template: () => <pos-contacts-contact-list contacts={[]}></pos-contacts-contact-list>,
      supportsShadowDom: false,
    });

    const list = getByRole(page.root, 'list');
    expect(list).toEqualHtml('<ul></ul>');
  });

  it('renders an list of contacts', async () => {
    const page = await newSpecPage({
      components: [ContactList],
      template: () => (
        <pos-contacts-contact-list
          contacts={[
            { uri: 'https://alice.test', name: 'Alice' },
            { uri: 'https://bob.test', name: 'Bob' },
          ]}
        ></pos-contacts-contact-list>
      ),
      supportsShadowDom: false,
    });

    const list = getByRole(page.root, 'list');
    expect(list).toEqualHtml(`
      <ul>
        <li>
          <a href='https://alice.test'>
            Alice
          </a>
        </li>
        <li>
          <a href='https://bob.test'>
            Bob
          </a>
        </li>
      </ul>
    `);
  });

  it('fires event when contact is selected', async () => {
    const page = await newSpecPage({
      components: [ContactList],
      template: () => <pos-contacts-contact-list contacts={[{ uri: 'https://alice.test', name: 'Alice' }]}></pos-contacts-contact-list>,
      supportsShadowDom: false,
    });

    const onContactSelected = jest.fn();
    page.root.addEventListener('pod-os-contacts:contact-selected', onContactSelected);

    const contact = getByRole(page.root, 'link');
    contact.click();
    expect(onContactSelected).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          uri: 'https://alice.test',
          name: 'Alice',
        },
      }),
    );
  });
});
