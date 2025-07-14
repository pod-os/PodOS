import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { mockSessionStore } from '../../../test/mockSessionStore';
import { PosNavigation } from '../pos-navigation';
import { pressKey } from '../../../test/pressKey';
import { typeToSearch } from './typeToSearch';

describe('pos-navigation', () => {
  it('renders navigation bar and search dialog', async () => {
    const page = await newSpecPage({
      components: [PosNavigation],
      html: `<pos-navigation uri="https://pod.example/resource" />`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
    <pos-navigation uri="https://pod.example/resource">
        <div class="container">
          <pos-navigation-bar></pos-navigation-bar>
          <dialog>
            <form method="dialog">
              <input enterkeyhint="search" placeholder="Search or enter URI" value="https://pod.example/resource">
            </form>
          </dialog>
        </div>
    </pos-navigation>`);
  });

  it('renders pos-navigation-bar when resource is loaded', async () => {
    const page = await newSpecPage({
      components: [PosNavigation],
      html: `<pos-navigation uri="https://pod.example/resource" />`,
      supportsShadowDom: false,
    });

    const mockResource = { fake: 'resource' };
    page.rootInstance.os = {
      store: {
        get: jest.fn().mockReturnValue(mockResource),
      },
    };

    await page.rootInstance.getResource('https://pod.example/resource');
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-navigation uri="https://pod.example/resource">
     <div class="container">
        <pos-navigation-bar></pos-navigation-bar>
        <dialog>
          <form method="dialog">
            <input enterkeyhint="search" placeholder="Search or enter URI" value="https://pod.example/resource"></input>
          </form>
        </dialog>
      </div>
    </pos-navigation>`);
  });

  it('opens the dialog when navigate event is emitted', async () => {
    // given a page with a navigation
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosNavigation],
      html: `<pos-navigation uri="https://pod.example/resource" />`,
    });

    const dialog = page.root.querySelector('dialog');
    dialog.show = jest.fn();

    // when a "navigate" event is emitted
    fireEvent(page.root, new CustomEvent('pod-os:navigate'));

    // then the dialog should be shown
    expect(dialog.show).toHaveBeenCalled();
  });

  it('navigates to entered URI when form is submitted', async () => {
    // given a page with a navigation bar
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosNavigation],
      html: `<pos-navigation uri="https://pod.example/resource" />`,
    });

    // and the page listens for pod-os:link events
    const linkEventListener = jest.fn();
    page.root.addEventListener('pod-os:link', linkEventListener);

    // when the user enters a URI into the searchbar
    await typeToSearch(page, 'https://resource.test/');

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
        components: [PosNavigation],
        html: `<pos-navigation uri="https://pod.example/resource" />`,
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
        rebuild: jest.fn(),
      };
      page.rootInstance.receivePodOs({
        store: {
          get: jest.fn().mockReturnValue({ fake: 'resource' }),
        },
        buildSearchIndex: jest.fn().mockReturnValue(mockSearchIndex),
      });

      // and the user is signed in
      await session.sessionChanged(true);
      await page.waitForChanges();

      // and therefore the search index is defined
      expect(page.rootInstance.searchIndex).toBeDefined();
    });

    it('informs navigation bar as soon as search index is available', () => {
      expect(page.root).toEqualHtml(`
        <pos-navigation uri="https://pod.example/resource">
          <div class="container">
            <pos-navigation-bar searchIndexReady=""></pos-navigation-bar>
              <dialog>
                <form method="dialog">
                  <input enterkeyhint="search" placeholder="Search or enter URI" value="https://pod.example/resource"></input>
                </form>
            </dialog>
          </div>
        </pos-navigation>`);
    });

    it(' searches for the typed text and shows suggestions', async () => {
      // when the user enters a text into the searchbar
      await typeToSearch(page, 'test');

      // then the search is triggered
      expect(mockSearchIndex.search).toHaveBeenNthCalledWith(1, 'test');

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
      await typeToSearch(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the input is cleared
      await typeToSearch(page, '');

      // then no suggestions are shown
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    describe('keyboard selection', () => {
      it('selects the first suggestion when pressing key down', async () => {
        // when the user enters a text into the searchbar
        await typeToSearch(page, 'test');

        // and then presses the down arrow key
        await pressKey(page, 'ArrowDown');

        // then the first suggestion is selected
        let suggestions = page.root.querySelectorAll('.suggestions li');
        expect(suggestions[0]).toHaveClass('selected');
        expect(suggestions[1]).not.toHaveClass('selected');
      });

      it('selects the second suggestion when pressing key down twice', async () => {
        // when the user enters a text into the searchbar
        await typeToSearch(page, 'test');

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
        await typeToSearch(page, 'test');

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
        await typeToSearch(page, 'test');

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
        await typeToSearch(page, 'test');

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
      await typeToSearch(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the user clicks into the search bar
      const searchBar = page.root.querySelector('input');
      searchBar.click();
      await page.waitForChanges();

      // then suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);
    });

    it('clears the suggestions when clicked elsewhere in the document', async () => {
      // given the user entered a text into the searchbar
      await typeToSearch(page, 'test');

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
      await typeToSearch(page, 'test');

      // and suggestions are shown
      expect(page.root.querySelectorAll('.suggestions li')).toHaveLength(2);

      // when the user presses escape
      await pressKey(page, 'Escape');

      // then the suggestions are cleared
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    it('clears the suggestions when navigating elsewhere', async () => {
      // given the user entered a text into the searchbar
      await typeToSearch(page, 'test');

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
      await typeToSearch(page, 'test');

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

    it('builds a new search index from scratch when a new index document has been added', async () => {
      expect(page.rootInstance.os.buildSearchIndex).toHaveBeenCalledTimes(1);
      page.rootInstance.os.buildSearchIndex.mockReturnValueOnce({ fake: 'search index from scratch' });
      fireEvent(
        page.root,
        new CustomEvent('pod-os:search:index-created', {
          detail: {
            fake: 'index',
          },
        }),
      );
      await page.waitForChanges();
      expect(page.rootInstance.os.buildSearchIndex).toHaveBeenCalledTimes(2);
      expect(page.rootInstance.searchIndex).toEqual({ fake: 'search index from scratch' });
    });

    it('rebuilds existing search index after new items have been indexed', async () => {
      expect(page.rootInstance.os.buildSearchIndex).toHaveBeenCalledTimes(1);
      fireEvent(
        page.root,
        new CustomEvent('pod-os:search:index-updated', {
          detail: {
            fake: 'index',
          },
        }),
      );
      await page.waitForChanges();
      expect(page.rootInstance.os.buildSearchIndex).toHaveBeenCalledTimes(1);
      expect(mockSearchIndex.rebuild).toHaveBeenCalledTimes(1);
    });
  });
});
