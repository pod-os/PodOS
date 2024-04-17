import { SessionInfo } from '@pod-os/core';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { OpenAddressBook } from '../open-address-book';

describe('open address book', () => {
  let page;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [OpenAddressBook],
      template: () => <pos-contacts-open-address-book />,
      supportsShadowDom: false,
    });
  });

  it('renders', () => {
    expect(page.root).toEqualHtml(`
   <pos-contacts-open-address-book>
    <div id="container">
      <div id="sign-in">
        <pos-login></pos-login>
        Sign in to list your address books.
      </div>
      <button class="open" title="open any other address book by it's URI">
        <ion-icon name="folder-open-outline"></ion-icon>
        open other
      </button>
    </div>
  </pos-contacts-open-address-book>`);
  });

  it('lists address books after login', async () => {
    const sessionInfo: SessionInfo = {
      isLoggedIn: true,
      webId: 'https://alice.test/profile/card#me',
      sessionId: 'test',
    };
    fireEvent(
      window,
      new CustomEvent('pod-os:session-changed', {
        detail: sessionInfo,
      }),
    );
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
    <pos-contacts-open-address-book>
      <div id="container">
        <pos-contacts-list-address-books webid="https://alice.test/profile/card#me"></pos-contacts-list-address-books>
        <button class="open" title="open any other address book by it's URI">
          <ion-icon name="folder-open-outline"></ion-icon>
          open other
        </button>
      </div>
    </pos-contacts-open-address-book>
    `);
  });
});
