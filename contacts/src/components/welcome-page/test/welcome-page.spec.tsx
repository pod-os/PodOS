import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { WelcomePage } from '../welcome-page';

describe('welcome page', () => {
  let page;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [WelcomePage],
      template: () => <pos-contacts-welcome-page />,
      supportsShadowDom: false,
    });
  });

  it('allows to sign in and open address book before login', () => {
    expect(page.root).toEqualHtml(`
      <pos-contacts-welcome-page>
        <header>
          <h1>
            PodOS contacts
          </h1>
          <pos-login></pos-login>
        </header>
        <main>
          <pos-contacts-open-address-book></pos-contacts-open-address-book>
        </main>
      </pos-contacts-welcome-page>`);
  });
});
