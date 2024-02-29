// noinspection ES6UnusedImports
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { getAllByRole, getByRole } from '@testing-library/dom';
import { EmailAddresses } from './email-addresses';

describe('email addresses', () => {
  it('shows nothing without email addresses', async () => {
    const page = await newSpecPage({
      components: [EmailAddresses],
      template: () => <pos-contacts-email-addresses emailAddresses={[]}></pos-contacts-email-addresses>,
    });
    expect(page.root).toEqualHtml(`
      <pos-contacts-email-addresses>
       <mock:shadow-root></mock:shadow-root>
      </pos-contacts-email-addresses>
    `);
  });

  it('shows a single e-mail address', async () => {
    const page = await newSpecPage({
      components: [EmailAddresses],
      template: () => (
        <pos-contacts-email-addresses
          emailAddresses={[
            {
              uri: 'https://contact.test#mail1',
              value: 'alice@mail.test',
            },
          ]}
        ></pos-contacts-email-addresses>
      ),
      supportsShadowDom: false,
    });
    const mail = getByRole(page.root, 'listitem');
    expect(mail.textContent).toEqual('alice@mail.test');
  });

  it('allows to send an email to an address', async () => {
    const page = await newSpecPage({
      components: [EmailAddresses],
      template: () => (
        <pos-contacts-email-addresses
          emailAddresses={[
            {
              uri: 'https://contact.test#mail1',
              value: 'alice@mail.test',
            },
          ]}
        ></pos-contacts-email-addresses>
      ),
      supportsShadowDom: false,
    });
    const link: HTMLLinkElement = getByRole(page.root, 'link');
    expect(link.href).toEqual('mailto:alice@mail.test');
  });

  it('shows all the e-mail addresses', async () => {
    const page = await newSpecPage({
      components: [EmailAddresses],
      template: () => (
        <pos-contacts-email-addresses
          emailAddresses={[
            {
              uri: 'https://contact.test#mail1',
              value: 'alice@mail.test',
            },
            {
              uri: 'https://contact.test#mail2',
              value: 'alice@work.test',
            },
          ]}
        ></pos-contacts-email-addresses>
      ),
      supportsShadowDom: false,
    });
    const mail = getAllByRole(page.root, 'listitem');
    expect(mail).toHaveLength(2);
    expect(mail[0].textContent).toEqual('alice@mail.test');
    expect(mail[1].textContent).toEqual('alice@work.test');
  });
});
