// noinspection ES6UnusedImports
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { getAllByRole, getByRole } from '@testing-library/dom';
import { PhoneNumbers } from './phone-numbers';

describe('phone numbers', () => {
  it('shows nothing without phone numbers', async () => {
    const page = await newSpecPage({
      components: [PhoneNumbers],
      template: () => <pos-contacts-phone-numbers phoneNumbers={[]}></pos-contacts-phone-numbers>,
    });
    expect(page.root).toEqualHtml(`
     <pos-contacts-phone-numbers>
        <mock:shadow-root></mock:shadow-root>
     </pos-contacts-phone-numbers>
    `);
  });

  it('shows a single phone number', async () => {
    const page = await newSpecPage({
      components: [PhoneNumbers],
      template: () => (
        <pos-contacts-phone-numbers
          phoneNumbers={[
            {
              uri: 'https://contact.test#phone1',
              value: '+1234',
            },
          ]}
        ></pos-contacts-phone-numbers>
      ),
      supportsShadowDom: false,
    });
    const phoneNumber = getByRole(page.root, 'listitem');
    expect(phoneNumber.textContent).toEqual('+1234');
  });

  it('allows to call a phone number', async () => {
    const page = await newSpecPage({
      components: [PhoneNumbers],
      template: () => (
        <pos-contacts-phone-numbers
          phoneNumbers={[
            {
              uri: 'https://contact.test#phone1',
              value: '+1234',
            },
          ]}
        ></pos-contacts-phone-numbers>
      ),
      supportsShadowDom: false,
    });
    const link: HTMLLinkElement = getByRole(page.root, 'link');
    expect(link.href).toEqual('tel:+1234');
  });

  it('shows all the phone numbers', async () => {
    const page = await newSpecPage({
      components: [PhoneNumbers],
      template: () => (
        <pos-contacts-phone-numbers
          phoneNumbers={[
            {
              uri: 'https://contact.test#phone1',
              value: '+1234',
            },
            {
              uri: 'https://contact.test#phone2',
              value: '5678',
            },
          ]}
        ></pos-contacts-phone-numbers>
      ),
      supportsShadowDom: false,
    });
    const phoneNumbers = getAllByRole(page.root, 'listitem');
    expect(phoneNumbers).toHaveLength(2);
    expect(phoneNumbers[0].textContent).toEqual('+1234');
    expect(phoneNumbers[1].textContent).toEqual('5678');
  });
});
