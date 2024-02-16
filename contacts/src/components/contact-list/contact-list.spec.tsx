import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

import { getByRole } from '@testing-library/dom';
import { ContactList } from './contact-list';

import '@testing-library/jest-dom';

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
          <a href="https://bob.test">
            Bob
          </a>
        </li>
      </ul>
    `);
  });
});
