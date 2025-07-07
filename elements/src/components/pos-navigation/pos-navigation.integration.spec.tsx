import { SearchIndex, WebIdProfile } from '@pod-os/core';
import { newSpecPage } from '@stencil/core/testing';
import { fireEvent, getByText } from '@testing-library/dom';
import { when } from 'jest-when';
import session from '../../store/session';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosRichLink } from '../pos-rich-link/pos-rich-link';
import { PosNavigation } from './pos-navigation';

describe('pos-navigation', () => {
  it('can search after login', async () => {
    // given PodOS
    const os = mockPodOS();

    // and it can build a search index
    const searchIndex = { search: jest.fn() } as SearchIndex;
    os.buildSearchIndex.mockResolvedValue(searchIndex);

    // and a search for "test" gives a result
    when(searchIndex.search)
      .calledWith('test')
      .mockReturnValue([
        {
          ref: 'https://result.test',
        },
      ]);

    // and a user profile can be fetched
    const profile = { fake: 'profile of the user' } as WebIdProfile;
    os.fetchProfile.mockResolvedValue(profile);

    // and a page with a navigation bar
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosApp, PosNavigation, PosRichLink],
      html: `<pos-app><pos-navigation></pos-navigation></pos-app>`,
    });

    // and the user is not logged in yet
    expect(session.state.isLoggedIn).toEqual(false);

    // when the user logs in
    os.login();
    await waitUntilLoggedIn();
    expect(session.state.isLoggedIn).toEqual(true);

    // then the search index is built based on the user profile
    expect(os.buildSearchIndex).toHaveBeenCalledWith(profile);
    await page.waitForChanges();

    // when the user types "test" into the navigation bar
    const searchBar = page.root.querySelector('ion-searchbar');
    fireEvent(searchBar, new CustomEvent('ionInput', { detail: { value: 'test' } }));

    // then a search is triggered
    expect(searchIndex.search).toHaveBeenCalledWith('test');

    // and the result is shown
    await page.waitForChanges();
    expect(getByText(page.root, 'result.test')).toBeDefined();
  });
});

async function waitUntilLoggedIn() {
  let unsubscribe;
  await new Promise((resolve, reject) => {
    unsubscribe = session.onChange('isLoggedIn', isLoggedIn => {
      if (isLoggedIn) {
        resolve();
      } else {
        reject();
      }
    });
  });
  unsubscribe();
}
