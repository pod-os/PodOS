jest.mock('../../../events/usePodOS');

import { PodOS, SessionInfo } from '@pod-os/core';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { when } from 'jest-when';
import { BehaviorSubject } from 'rxjs';
import { usePodOS } from '../../../events/usePodOS';
import { OpenAddressBook } from '../open-address-book';

describe('open address book', () => {
  let page;
  const sessionInfo$ = new BehaviorSubject<SessionInfo>({
    sessionId: 'test-session',
    isLoggedIn: false,
    webId: '',
  });
  beforeEach(async () => {
    when(usePodOS).mockResolvedValue({
      observeSession: () => sessionInfo$,
    } as unknown as PodOS);
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
    sessionInfo$.next({
      isLoggedIn: true,
      webId: 'https://alice.test/profile/card#me',
      sessionId: 'test',
    });
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
