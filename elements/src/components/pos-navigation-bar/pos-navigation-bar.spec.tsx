import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { mockSessionStore } from '../../test/mockSessionStore';
import { PosNavigationBar } from './pos-navigation-bar';
import { pressKey } from '../../test/pressKey';

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
          <pos-make-findable uri="https://pod.example/resource"></pos-make-findable>
          <div class="bar">
            <ion-searchbar debounce="300" enterkeyhint="search" placeholder="Search or enter URI" value="https://pod.example/resource"></ion-searchbar>
          </div>
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
    let session;
    beforeEach(async () => {
      // given a fake session store
      session = mockSessionStore();

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
        clear: jest.fn(),
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
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the input is cleared
      await type(page, '');

      // then no suggestions are shown
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    describe('keyboard selection', () => {
      it('selects the first suggestion when pressing key down', async () => {
        // when the user enters a text into the searchbar
        await type(page, 'test');

        // and then presses the down arrow key
        await pressKey(page, 'ArrowDown');

        // then the first suggestion is selected
        let suggestions = page.root.querySelectorAll('.suggestions li');
        expect(suggestions[0]).toHaveClass('selected');
        expect(suggestions[1]).not.toHaveClass('selected');
      });

      it('selects the second suggestion when pressing key down twice', async () => {
        // when the user enters a text into the searchbar
        await type(page, 'test');

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');

        // then the first suggestion is selected
        let suggestions = page.root.querySelectorAll('.suggestions li');
        expect(suggestions[0]).not.toHaveClass('selected');
        expect(suggestions[1]).toHaveClass('selected');
      });

      it('selects the first suggestion when moving down twice than up', async () => {
        // when the user enters a text into the searchbar
        await type(page, 'test');

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowUp');

        // then the first suggestion is selected
        let suggestions = page.root.querySelectorAll('.suggestions li');
        expect(suggestions[0]).toHaveClass('selected');
        expect(suggestions[1]).not.toHaveClass('selected');
      });

      it('cannot move further up than top result', async () => {
        // when the user enters a text into the searchbar
        await type(page, 'test');

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowUp');
        await pressKey(page, 'ArrowUp');

        // then the first suggestion is selected
        let suggestions = page.root.querySelectorAll('.suggestions li');
        expect(suggestions[0]).toHaveClass('selected');
        expect(suggestions[1]).not.toHaveClass('selected');
      });

      it('cannot move further down than the last result', async () => {
        // when the user enters a text into the searchbar
        await type(page, 'test');

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');

        // then the first suggestion is selected
        let suggestions = page.root.querySelectorAll('.suggestions li');
        expect(suggestions).toHaveLength(2);
        expect(suggestions[0]).not.toHaveClass('selected');
        expect(suggestions[1]).toHaveClass('selected');
      });
    });

    it('does not clear suggestions when clicked on itself', async () => {
      // given the user entered a text into the searchbar
      await type(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the user clicks into the search bar
      const searchBar = page.root.querySelector('ion-searchbar');
      searchBar.click();
      await page.waitForChanges();

      // then suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);
    });

    it('clears the suggestions when clicked elsewhere in the document', async () => {
      // given the user entered a text into the searchbar
      await type(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the user clicks anywhere
      page.doc.click();
      await page.waitForChanges();

      // then the suggestions are cleared
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    it('clears the suggestions when escape is pressed', async () => {
      // given the user entered a text into the searchbar
      await type(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the user presses escape
      await pressKey(page, 'Escape');

      // then the suggestions are cleared
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    it('clears the suggestions when navigating elsewhere', async () => {
      // given the user entered a text into the searchbar
      await type(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the user clicks on a link
      fireEvent(page.root, new CustomEvent('pod-os:link', { detail: 'any' }));
      await page.waitForChanges();

      // then the suggestions are cleared
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    it('navigates to selected suggestion when the form is submitted', async () => {
      // given the page listens for pod-os:link events
      const linkEventListener = jest.fn();
      page.root.addEventListener('pod-os:link', linkEventListener);

      // when the user enters a text into the searchbar
      await type(page, 'test');

      // and then presses the down arrow key to select the first result
      await pressKey(page, 'ArrowDown');

      // and then submits the form
      const form = page.root.querySelector('form');
      fireEvent(form, new CustomEvent('submit', {}));

      // then a pod-os:link event with the URI of the selected item is received in the listener
      expect(linkEventListener).toHaveBeenCalledTimes(1);
      expect(linkEventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: 'https://result.test/1',
        }),
      );
    });

    it('clears the index when logging out', async () => {
      // when the user signs out
      await session.sessionChanged(false);

      // then the search index is cleared
      expect(mockSearchIndex.clear).toHaveBeenCalled();
    });
  });
});

async function type(page, text: string) {
  const searchBar = page.root.querySelector('ion-searchbar');
  fireEvent(searchBar, new CustomEvent('ionInput', { detail: { value: text } }));
  await page.waitForChanges();
}
