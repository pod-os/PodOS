import { vi } from 'vitest';
import { afterEach, beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';

import { fireEvent, waitFor } from '@testing-library/dom';
import '../pos-navigation';
import { pressKey } from '../../../test/pressKey';
import { typeToSearch } from './typeToSearch.vitest';

import session from '../../../store/session';
import { PodOS, SearchIndex } from '@pod-os/core';
import { mockOsProvider } from '../../../test/mockPodOS.vitest';
import { withinShadow } from '../../../test/withinShadow';
import { userEvent } from '@testing-library/user-event';

describe('pos-navigation', () => {
  it('renders navigation bar and search dialog', async () => {
    const page = await render(<pos-navigation uri="https://pod.example/resource"></pos-navigation>);
    expect(page.root.shadowRoot).toEqualHtml(`
      <nav>
        <search>
          <pos-navigation-bar></pos-navigation-bar>
          <dialog>
            <form method="dialog">
              <input
                enterkeyhint="search"
                aria-label="Search or enter URI"
                placeholder="Search or enter URI"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="suggestions-list">
            </form>
          </dialog>
        </search>
      </nav>
    `);
  });

  it('renders pos-navigation-bar when resource is loaded', async () => {
    const mockResource = { fake: 'resource' };
    mockOsProvider({
      store: {
        get: vi.fn().mockReturnValue(mockResource),
      },
    } as unknown as PodOS);

    const page = await render(<pos-navigation uri="https://pod.example/resource"></pos-navigation>);

    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <nav>
        <search>
          <pos-navigation-bar></pos-navigation-bar>
          <dialog>
            <form method="dialog">
              <input
                enterkeyhint="search"
                aria-label="Search or enter URI"
                placeholder="Search or enter URI"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="suggestions-list">
            </form>
          </dialog>
        </search>
      </nav>
    `);
  });

  it('updates current resource when uri changes', async () => {
    const page = await render(<pos-navigation uri="https://pod.example/resource"></pos-navigation>);

    const mockResource = { fake: 'resource' };
    page.instance.os = {
      store: {
        get: vi.fn().mockReturnValue(mockResource),
      },
    };

    page.instance.uri = 'https://pod.example/resource';
    page.instance.updateResource(mockResource);

    expect(page.instance.resource).toEqual(mockResource);
  });

  it('sets current resource to null when uri is invalid', async () => {
    const page = await render(<pos-navigation uri="https://pod.example/resource"></pos-navigation>);

    const mockResource = { fake: 'resource' };
    const get = vi.fn();
    get.mockImplementation(() => {
      throw new Error('Invalid URI');
    });
    page.instance.os = {
      store: {
        get,
      },
    };

    page.instance.uri = 'irrelevant, since store mock throws error';
    page.instance.updateResource(mockResource);

    expect(page.instance.resource).toEqual(null);
  });

  it('selects all text & opens the dialog when navigate event is emitted', async () => {
    // given a page with a navigation
    const page = await render(<pos-navigation uri="https://pod.example/resource"></pos-navigation>);

    const dialog = page.root.shadowRoot!.querySelector('dialog')!;
    const input = page.root.shadowRoot!.querySelector('input')!;
    dialog.show = vi.fn();
    input.select = vi.fn();

    // when a "navigate" event is emitted
    fireEvent(page.root, new CustomEvent('pod-os:navigate'));

    // then the dialog should be shown
    expect(dialog.show).toHaveBeenCalled();
    expect(input.select).toHaveBeenCalled();
  });

  it('navigates to entered URI when form is submitted', async () => {
    // given a page with a navigation bar
    const page = await render(<pos-navigation uri="https://pod.example/resource"></pos-navigation>);

    // and the page listens for pod-os:link events
    const linkEventListener = vi.fn();
    page.root.addEventListener('pod-os:link', linkEventListener);

    // when the user enters a URI into the searchbar
    await typeToSearch(page, 'https://resource.test/');

    // and then submits the form
    const form = page.root.shadowRoot!.querySelector('form')!;
    fireEvent(form, new CustomEvent('submit', {}));

    // then a pod-os:link event with this URI is received in the listener
    expect(linkEventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'https://resource.test/',
      }),
    );
  });

  describe('searching when logged in', () => {
    let page: RenderResult;

    let mockSearchIndex: SearchIndex;
    beforeEach(async () => {
      // and a page with a navigation nar
      mockSearchIndex = {
        search: vi.fn().mockReturnValue([
          {
            ref: 'https://result.test/1',
          },
          {
            ref: 'https://result.test/2',
          },
        ]),
        clear: vi.fn(),
        rebuild: vi.fn(),
      } as unknown as SearchIndex;
      mockOsProvider({
        store: {
          get: vi.fn().mockReturnValue({ fake: 'resource' }),
        },
        buildSearchIndex: vi.fn().mockReturnValue(mockSearchIndex),
      } as unknown as PodOS);

      page = await render(<pos-navigation uri="https://pod.example/resource"></pos-navigation>);
      // and a fake search index giving 2 results

      // and the user is signed in
      session.state.isLoggedIn = true;
      await page.waitForChanges();

      // and therefore the search index is defined
      await waitFor(() => {
        expect(page.instance.searchIndex).toBeDefined();
      });
    });

    afterEach(() => {
      // ensure the element is disconnected before disposing the session
      // this is important, because stencil testing will disconnect it "eventually" but
      // if we do not clean up before disposing the session the change handler will still trigger
      page.instance.disconnectedCallback();
      session.dispose();
    });

    it('informs navigation bar as soon as search index is available', () => {
      expect(page.root.shadowRoot).toEqualHtml(`
          <nav>
            <search>
              <pos-navigation-bar searchindexready></pos-navigation-bar>
              <dialog>
                <form method="dialog">
                  <input
                    enterkeyhint="search"
                    aria-label="Search or enter URI"
                    placeholder="Search or enter URI"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-controls="suggestions-list">
                </form>
              </dialog>
            </search>
          </nav>`);
    });

    it(' searches for the typed text and shows suggestions', async () => {
      // when the user enters a text into the searchbar
      await typeToSearch(page, 'test');

      // then the search is triggered
      await waitFor(() => {
        expect(mockSearchIndex.search).toHaveBeenNthCalledWith(1, 'test');
      });

      // and the results are shown as suggestions
      const suggestions = page.root.shadowRoot!.querySelector('.suggestions')!;
      expect(suggestions).toMatchInlineSnapshot(`
        <div
          class="suggestions"
        >
          <ol
            aria-label="Search results"
            id="suggestions-list"
            role="listbox"
          >
            <li
              aria-selected="false"
              id="option-0"
              role="option"
            >
              <pos-rich-link uri="https://result.test/1"></pos-rich-link>
            </li>
            <li
              aria-selected="false"
              id="option-1"
              role="option"
            >
              <pos-rich-link uri="https://result.test/2"></pos-rich-link>
            </li>
          </ol>
        </div>
      `);
    });

    it('selects all text & searches for the current resource on navigate event', async () => {
      const dialog = page.root.shadowRoot!.querySelector('dialog')!;
      const input = page.root.shadowRoot!.querySelector('input')!;
      dialog.show = vi.fn();
      input.select = vi.fn();

      // when a "navigate" event is emitted
      fireEvent(
        page.root,
        new CustomEvent('pod-os:navigate', { detail: { uri: 'https://pod.example/current-resource' } }),
      );

      // then the dialog should be shown and search for the current resource
      expect(dialog.show).toHaveBeenCalled();
      expect(input.select).toHaveBeenCalled();
      expect(mockSearchIndex.search).toHaveBeenNthCalledWith(1, 'https://pod.example/current-resource');
    });

    it('selects all text & does not search on navigate event if current resource is missing', async () => {
      const dialog = page.root.shadowRoot!.querySelector('dialog')!;
      const input = page.root.shadowRoot!.querySelector('input')!;
      dialog.show = vi.fn();
      input.select = vi.fn();

      // when a "navigate" event is emitted
      fireEvent(page.root, new CustomEvent('pod-os:navigate'));

      // then the dialog should be shown but no search is triggered
      expect(dialog.show).toHaveBeenCalled();
      expect(input.select).toHaveBeenCalled();
      expect(mockSearchIndex.search).not.toHaveBeenCalled();
    });

    async function searchAndWait() {
      await typeToSearch(page, 'test');
      await waitFor(() => {
        expect(mockSearchIndex.search).toHaveBeenNthCalledWith(1, 'test');
      });

      fireEvent(page.root, new CustomEvent('pod-os:navigate')); // needed to open the dialog with suggestions
      await page.waitForChanges();
    }

    it('clears the suggestions when nothing is entered', async () => {
      // given the user entered a text into the searchbar
      await searchAndWait();

      expect(withinShadow(page).getAllByRole('option')).toHaveLength(2);

      // when the input is cleared
      await typeToSearch(page, '');

      // then no suggestions are shown
      expect(page.root.querySelector('.suggestions')).toBeNull();
    });

    describe('keyboard selection', () => {
      it('selects the first suggestion when pressing key down', async () => {
        // when the user enters a text into the searchbar
        await searchAndWait();

        // and then presses the down arrow key
        await pressKey(page, 'ArrowDown');

        // then the first suggestion is selected
        const input = withinShadow(page).getByRole('combobox');
        expect(input).toEqualAttribute('aria-activedescendant', 'option-0');
        const suggestions = withinShadow(page).getAllByRole('option');
        expect(suggestions[0]).toEqualAttribute('aria-selected', 'true');
        expect(suggestions[1]).toEqualAttribute('aria-selected', 'false');
      });

      it('selects the second suggestion when pressing key down twice', async () => {
        // when the user enters a text into the searchbar
        await searchAndWait();

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');

        // then the second suggestion is selected
        const input = withinShadow(page).getByRole('combobox');
        expect(input).toEqualAttribute('aria-activedescendant', 'option-1');
        const suggestions = withinShadow(page).getAllByRole('option');
        expect(suggestions[0]).toEqualAttribute('aria-selected', 'false');
        expect(suggestions[1]).toEqualAttribute('aria-selected', 'true');
      });

      it('selects the first suggestion when moving down twice than up', async () => {
        // when the user enters a text into the searchbar
        await searchAndWait();

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowUp');

        // then the first suggestion is selected
        const input = withinShadow(page).getByRole('combobox');
        expect(input).toEqualAttribute('aria-activedescendant', 'option-0');
        const suggestions = withinShadow(page).getAllByRole('option');
        expect(suggestions[0]).toEqualAttribute('aria-selected', 'true');
        expect(suggestions[1]).toEqualAttribute('aria-selected', 'false');
      });

      it('cannot move further up than top result', async () => {
        // when the user enters a text into the searchbar
        await searchAndWait();

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowUp');
        await pressKey(page, 'ArrowUp');

        // then the first suggestion is selected
        const input = withinShadow(page).getByRole('combobox');
        expect(input).toEqualAttribute('aria-activedescendant', 'option-0');
        const suggestions = withinShadow(page).getAllByRole('option');
        expect(suggestions[0]).toEqualAttribute('aria-selected', 'true');
        expect(suggestions[1]).toEqualAttribute('aria-selected', 'false');
      });

      it('cannot move further down than the last result', async () => {
        // when the user enters a text into the searchbar
        await searchAndWait();

        // and then presses the down arrow key twice
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');
        await pressKey(page, 'ArrowDown');

        // then the first suggestion is selected
        const input = withinShadow(page).getByRole('combobox');
        expect(input).toEqualAttribute('aria-activedescendant', 'option-1');
        const suggestions = withinShadow(page).getAllByRole('option');
        expect(suggestions).toHaveLength(2);
        expect(suggestions[0]).toEqualAttribute('aria-selected', 'false');
        expect(suggestions[1]).toEqualAttribute('aria-selected', 'true');
      });
    });

    it('does not clear suggestions when clicked on itself', async () => {
      // given the user entered a text into the searchbar
      await searchAndWait();

      // and suggestions are shown
      expect(withinShadow(page).getAllByRole('option')).toHaveLength(2);

      // when the user clicks into the search bar
      const searchBar = page.root.shadowRoot!.querySelector('input')!;
      searchBar.click();
      await page.waitForChanges();

      // then suggestions are shown
      expect(withinShadow(page).getAllByRole('option')).toHaveLength(2);
    });

    it('closes the suggestions when clicked elsewhere in the document', async () => {
      const dialog = page.root.shadowRoot!.querySelector('dialog')!;
      dialog.close = vi.fn();

      // given the user entered a text into the searchbar
      await searchAndWait();

      // and suggestions are shown
      expect(withinShadow(page).getAllByRole('option')).toHaveLength(2);

      // when the user clicks anywhere
      await userEvent.click(document.documentElement);
      await page.waitForChanges();

      // then the dialog is closed
      expect(dialog.close).toHaveBeenCalled();
    });

    it('closes the suggestions when escape is pressed', async () => {
      const dialog = page.root.shadowRoot!.querySelector('dialog')!;
      dialog.close = vi.fn();

      // given the user entered a text into the searchbar
      await searchAndWait();

      // and suggestions are shown
      expect(withinShadow(page).getAllByRole('option')).toHaveLength(2);

      // when the user presses escape
      await pressKey(page, 'Escape');

      // then the dialog is closed
      expect(dialog.close).toHaveBeenCalled();
    });

    it('clears the suggestions when navigating elsewhere', async () => {
      const dialog = page.root.shadowRoot!.querySelector('dialog')!;
      dialog.close = vi.fn();

      // given the user entered a text into the searchbar
      await searchAndWait();

      // and suggestions are shown
      expect(withinShadow(page).getAllByRole('option')).toHaveLength(2);

      // when the user clicks on a link
      fireEvent(page.root, new CustomEvent('pod-os:link', { detail: 'any' }));
      await page.waitForChanges();

      // then the suggestions are cleared
      expect(page.root.querySelector('.suggestions')).toBeNull();

      // and the dialog is closed
      expect(dialog.close).toHaveBeenCalled();
    });

    it('navigates to selected suggestion when the form is submitted', async () => {
      // given the page listens for pod-os:link events
      const linkEventListener = vi.fn();
      page.root.addEventListener('pod-os:link', linkEventListener);

      // when the user enters a text into the searchbar
      await searchAndWait();

      // and then presses the down arrow key to select the first result
      await pressKey(page, 'ArrowDown');

      // and then submits the form
      const form = page.root.shadowRoot!.querySelector('form')!;
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
      session.state.isLoggedIn = false;

      // then the search index is cleared
      expect(mockSearchIndex.clear).toHaveBeenCalled();
    });

    it('builds a new search index from scratch when a new index document has been added', async () => {
      expect(page.instance.os.buildSearchIndex).toHaveBeenCalledTimes(1);
      page.instance.os.buildSearchIndex.mockReturnValueOnce({ fake: 'search index from scratch' });
      fireEvent(
        page.root,
        new CustomEvent('pod-os:search:index-created', {
          detail: {
            fake: 'index',
          },
        }),
      );
      await page.waitForChanges();
      expect(page.instance.os.buildSearchIndex).toHaveBeenCalledTimes(2);
      expect(page.instance.searchIndex).toEqual({ fake: 'search index from scratch' });
    });

    it('rebuilds existing search index after new items have been indexed', async () => {
      expect(page.instance.os.buildSearchIndex).toHaveBeenCalledTimes(1);
      fireEvent(
        page.root,
        new CustomEvent('pod-os:search:index-updated', {
          detail: {
            fake: 'index',
          },
        }),
      );
      await page.waitForChanges();
      expect(page.instance.os.buildSearchIndex).toHaveBeenCalledTimes(1);
      expect(mockSearchIndex.rebuild).toHaveBeenCalledTimes(1);
    });
  });
});
