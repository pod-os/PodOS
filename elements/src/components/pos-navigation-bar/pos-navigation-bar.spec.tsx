import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { mockSessionStore } from '../../test/mockSessionStore';
import { PosNavigationBar } from './pos-navigation-bar';

describe('pos-navigation-bar', () => {
  it('renders a search bar within a form', async () => {
    const page = await newSpecPage({
      components: [PosNavigationBar],
      html: `<pos-navigation-bar uri="https://pod.example/resource" />`,
    });
    expect(page.root).toEqualHtml(`
    <pos-navigation-bar uri="https://pod.example/resource">
      <mock:shadow-root>
        <form>
          <ion-searchbar debounce="0" enterkeyhint="search" placeholder="Enter URI" value="https://pod.example/resource"></ion-searchbar>
        </form>
      </mock:shadow-root>
    </pos-navigation-bar>`);
  });

  it('navigates to entered URI when form is submitted', async () => {
    // given a page with a navigation bar
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosNavigationBar],
      html: `<pos-navigation-bar uri="https://pod.example/resource" />`,
    });

    // and the page listens for pod-os:link events
    const linkEventListener = jest.fn();
    page.root.addEventListener('pod-os:link', linkEventListener);

    // when the user enters a URI into the searchbar
    const searchBar = page.root.querySelector('ion-searchbar');
    fireEvent(searchBar, new CustomEvent('ionInput', { detail: { value: 'https://resource.test/' } }));

    // and then submits the form
    const form = page.root.querySelector('form');
    fireEvent(form, new CustomEvent('submit', {}));

    // then a pod-os:link event with this URI is received in the listener
    expect(linkEventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'https://resource.test/',
      }),
    );
  });

  it('when logged in, searches for the typed text and shows suggestions', async () => {
    // given a fake session store
    const session = mockSessionStore();

    // and a page with a navigation nar
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosNavigationBar],
      html: `<pos-navigation-bar uri="https://pod.example/resource" />`,
    });

    // and a fake search index giving 2 results
    const mockSearchIndex = {
      search: jest.fn().mockReturnValue([
        {
          ref: 'https://result.test/1',
        },
        {
          ref: 'https://result.test/2',
        },
      ]),
    };
    page.rootInstance.receivePodOs({
      buildSearchIndex: jest.fn().mockReturnValue(mockSearchIndex),
    });

    // and the user is signed in
    await session.sessionChanged(true);

    // and therefore the search index is defined
    expect(page.rootInstance.searchIndex).toBeDefined();

    // when the user enters a text into the searchbar
    const searchBar = page.root.querySelector('ion-searchbar');
    fireEvent(searchBar, new CustomEvent('ionInput', { detail: { value: 'test' } }));
    await page.waitForChanges();

    // then the search is triggered
    expect(mockSearchIndex.search).toHaveBeenCalledWith('test');

    // and the results are shown as suggestions
    let suggestions = page.root.querySelector('.suggestions');
    expect(suggestions).toEqualHtml(
      `<div class="suggestions">
  <ol>
    <li>
      <pos-rich-link uri="https://result.test/1"></pos-rich-link>
    </li>
    <li>
      <pos-rich-link uri="https://result.test/2"></pos-rich-link>
    </li>
  </ol>
</div>`,
    );
  });
});
