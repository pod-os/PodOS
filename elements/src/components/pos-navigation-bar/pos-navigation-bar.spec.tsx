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
    await type(page, 'https://resource.test/');

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

  describe('searching when logged in', () => {
    let page;
    let mockSearchIndex;
    beforeEach(async () => {
      // given a fake session store
      const session = mockSessionStore();

      // and a page with a navigation nar
      page = await newSpecPage({
        supportsShadowDom: false,
        components: [PosNavigationBar],
        html: `<pos-navigation-bar uri="https://pod.example/resource" />`,
      });

      // and a fake search index giving 2 results
      mockSearchIndex = {
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
    });

    it(' searches for the typed text and shows suggestions', async () => {
      // when the user enters a text into the searchbar
      await type(page, 'test');

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

    it('clears the suggestions when nothing is entered', async () => {
      // given the user entered a text into the searchbar
      await type(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelector('.suggestions')).toBeDefined();

      // when the input is cleared
      await type(page, '');

      // then no suggestions are shown
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    it('clears the suggestions when clicked anywhere in document', async () => {
      // given the user entered a text into the searchbar
      await type(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelector('.suggestions')).toBeDefined();

      // when the user clicks anywhere
      const searchBar = page.root.querySelector('ion-searchbar');
      page.doc.click();
      await page.waitForChanges();

      // then no suggestions are shown
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });
  });
});

async function type(page, text: string) {
  const searchBar = page.root.querySelector('ion-searchbar');
  fireEvent(searchBar, new CustomEvent('ionInput', { detail: { value: text } }));
  await page.waitForChanges();
}
