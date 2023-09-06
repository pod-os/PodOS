import { SearchIndex, WebIdProfile } from '@pod-os/core';
import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import session from '../../store/session';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosNavigationBar } from './pos-navigation-bar';

describe('pos-navigation-bar', () => {

  it('can search after login', async () => {
    const os = mockPodOS();
    const searchIndex = { search: jest.fn() } as SearchIndex;
    os.buildSearchIndex.mockResolvedValue(searchIndex);
    const profile = {fake: 'profile of the user'} as WebIdProfile
    os.fetchProfile.mockResolvedValue(profile)
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosApp, PosNavigationBar],
      html: `<pos-app><pos-navigation-bar></pos-navigation-bar></pos-app>`,
    });

    expect(session.state.isLoggedIn).toEqual(false);
    os.login();
    await waitUntilLoggedIn();
    expect(session.state.isLoggedIn).toEqual(true);
    expect(os.buildSearchIndex).toHaveBeenCalledWith(profile);
    await page.waitForChanges()

    const searchBar = page.root.querySelector('ion-searchbar');
    fireEvent(searchBar, new CustomEvent('ionChange', { detail: { value: 'test' } }));
    expect(searchIndex.search).toHaveBeenCalledWith('test');
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
