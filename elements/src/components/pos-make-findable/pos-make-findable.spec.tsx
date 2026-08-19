import { Mock, vi } from 'vitest';

import { afterEach, beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';

import './pos-make-findable';

import { when } from 'vitest-when';
import session from '../../store/session';
import { LabelIndex, PodOS, Thing, WebIdProfile } from '@pod-os/core';
import { withinShadow } from '../../test/withinShadow';
import { mockOsProvider } from '../../test/mockPodOS.vitest';
import { userEvent } from '@testing-library/user-event';

vi.mock('./shoelace', () => ({}));
vi.mock('@pod-os/core', () => ({
  LabelIndex: class {
    fake = 'LabelIndex';
  },
}));

describe('pos-make-findable', () => {
  let page!: RenderResult;

  afterEach(() => {
    page.instance.disconnectedCallback();
    session.dispose();
  });

  it('renders a button, when logged in', async () => {
    session.state.isLoggedIn = true;
    page = await render(<pos-make-findable uri="https://any.thing.example"></pos-make-findable>);

    const button = withinShadow(page).getByRole('button');
    expect(button).toBeDefined();
    expect(button.textContent).toEqual('Make this findable');
  });

  it('add thing to a single private label index', async () => {
    // given a user profile in the current session with a single private label index
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => ['https://pod.example/label-index'],
    } as unknown as WebIdProfile;

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: vi.fn(),
      },
      addToLabelIndex: vi.fn(),
    } as unknown as PodOS;
    when(mockOs.store.get)
      .calledWith('https://thing.example#it')
      .thenReturn({ fake: 'thing' } as unknown as Thing);
    const labelIndexAssume = vi.fn();
    when(labelIndexAssume)
      .calledWith(LabelIndex)
      .thenReturn({ fake: 'index', contains: () => false });
    when(mockOs.store.get)
      .calledWith('https://pod.example/label-index')
      .thenReturn({
        assume: labelIndexAssume,
      } as unknown as Thing);
    // and the component received that PodOs instance
    mockOsProvider(mockOs);

    // and the document listens for index updates
    const indexUpdateListener = vi.fn();
    document.addEventListener('pod-os:search:index-updated', indexUpdateListener);

    // and a make findable component for a thing
    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // when the button is clicked
    const button = withinShadow(page).getByRole('button');
    await userEvent.click(button);

    // then the thing is added to the index
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith({ fake: 'thing' }, expect.objectContaining({ fake: 'index' }));

    // and the state changes to indexed
    expect(page.instance.isIndexed).toEqual(true);

    // and an index update event is emitted
    expect(indexUpdateListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          fake: 'index',
        }),
      }),
    );
  });

  it('indicates if thing is already indexed', async () => {
    // given a user profile in the current session with a single private label index
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => ['https://pod.example/label-index'],
    } as unknown as WebIdProfile;

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: vi.fn(),
      },
    } as unknown as PodOS;
    when(mockOs.store.get)
      .calledWith('https://thing.example#it')
      .thenReturn({ fake: 'thing' } as unknown as Thing);
    const contains = vi.fn();
    const labelIndexAssume = vi.fn();
    when(labelIndexAssume).calledWith(LabelIndex).thenReturn({ fake: 'index', contains });
    when(mockOs.store.get)
      .calledWith('https://pod.example/label-index')
      .thenReturn({
        assume: labelIndexAssume,
      } as unknown as Thing);
    mockOsProvider(mockOs);

    // and the index already contains the URI
    when(contains).calledWith('https://thing.example#it').thenReturn(true);

    // when a make-findable component for the thing is rendered
    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // then the state indicates that the URI is already indexed
    expect(page.instance.isIndexed).toEqual(true);
  });

  it('emits error if updating the index fails', async () => {
    // given a user profile in the current session with a single private label index
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => ['https://pod.example/label-index'],
    } as unknown as WebIdProfile;

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: vi.fn(),
      },
      addToLabelIndex: vi.fn(),
    } as unknown as PodOS;
    when(mockOs.store.get)
      .calledWith('https://thing.example#it')
      .thenReturn({ fake: 'thing' } as unknown as Thing);
    const labelIndexAssume = vi.fn();
    when(labelIndexAssume)
      .calledWith(LabelIndex)
      .thenReturn({ fake: 'index', contains: () => false });
    when(mockOs.store.get)
      .calledWith('https://pod.example/label-index')
      .thenReturn({
        assume: labelIndexAssume,
      } as unknown as Thing);
    mockOsProvider(mockOs);

    // and the page listens for error
    const errorListener = vi.fn();
    document.addEventListener('pod-os:error', errorListener);

    // and a make findable component for a thing
    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // but leads to an error when adding a thing to index
    (mockOs.addToLabelIndex as Mock).mockRejectedValue(new Error('simulated error'));

    // when the button is clicked
    const button = withinShadow(page).getByRole('button');
    await userEvent.click(button);
    await page.waitForChanges();

    // then an error event is emitted
    expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ detail: new Error('simulated error') }));
  });

  it('creates a default label index if none exists and then uses it to make the thing findable', async () => {
    // given a user profile in the current session with no private label index
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => [],
    } as unknown as WebIdProfile;

    // and a PodOS instance that yields a Thing for the URI in question
    const mockOs = {
      store: {
        get: vi.fn(),
      },
      addToLabelIndex: vi.fn(),
      createDefaultLabelIndex: vi.fn(),
    } as unknown as PodOS;
    when(mockOs.store.get)
      .calledWith('https://thing.example#it')
      .thenReturn({ fake: 'thing' } as unknown as Thing);

    // and it is able to create a default index for the user profile
    when(mockOs.createDefaultLabelIndex)
      .calledWith(session.state.profile)
      .thenResolve({ fake: 'newly created default index' } as unknown as LabelIndex);
    mockOsProvider(mockOs);

    // and the page listens for index creation
    const indexCreatedListener = vi.fn();
    document.addEventListener('pod-os:search:index-created', indexCreatedListener);

    // and a make findable component for a thing
    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // when the button is clicked
    const button = withinShadow(page).getByRole('button');
    await userEvent.click(button);

    // then the thing is added to the index
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith(
      { fake: 'thing' },
      expect.objectContaining({ fake: 'newly created default index' }),
    );

    // and the state changes to indexed
    expect(page.instance.isIndexed).toEqual(true);

    // and an index created event is emitted
    expect(indexCreatedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          fake: 'newly created default index',
        }),
      }),
    );
  });

  it('emits error if creating the default index fails', async () => {
    // given a user profile in the current session with no private label index
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => [],
    } as unknown as WebIdProfile;

    // and a PodOS instance that yields a Thing for the URI in question
    const mockOs = {
      store: {
        get: vi.fn(),
      },
      addToLabelIndex: vi.fn(),
      createDefaultLabelIndex: vi.fn(),
    } as unknown as PodOS;
    when(mockOs.store.get)
      .calledWith('https://thing.example#it')
      .thenReturn({ fake: 'thing' } as unknown as Thing);

    // but leads to an error when creating the default index
    when(mockOs.createDefaultLabelIndex).calledWith(session.state.profile).thenReject(new Error('simulated error'));
    mockOsProvider(mockOs);

    // and a make findable component for a thing
    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // and the page listens for error
    const errorListener = vi.fn();
    page.root.addEventListener('pod-os:error', errorListener);

    // when the button is clicked
    const button = withinShadow(page).getByRole('button');
    await userEvent.click(button);

    // then an error event is emitted
    expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ detail: new Error('simulated error') }));
  });

  describe('does not show up', () => {
    it('if URI is empty', async () => {
      // given no user session
      session.state.isLoggedIn = true;
      // and a make findable component for a thing
      page = await render(<pos-make-findable uri=""></pos-make-findable>);
      // then nothing shows up
      expect(page.root).toBeEmptyDOMElement();
    });

    it('when not logged in', async () => {
      // given no user session
      session.state.isLoggedIn = false;
      // and a make findable component for a thing
      page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);
      // then nothing shows up
      expect(page.root).toBeEmptyDOMElement();
    });
  });

  it('can be used, after the user signed in', async () => {
    // given no user session yet
    session.state.isLoggedIn = false;
    // and a make findable component for a thing

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: vi.fn(),
      },
      addToLabelIndex: vi.fn(),
    } as unknown as PodOS;
    when(mockOs.store.get)
      .calledWith('https://thing.example#it')
      .thenReturn({ fake: 'thing' } as unknown as Thing);
    const labelIndexAssume = vi.fn();
    when(labelIndexAssume)
      .calledWith(LabelIndex)
      .thenReturn({ fake: 'index', contains: () => false });
    when(mockOs.store.get)
      .calledWith('https://pod.example/label-index')
      .thenReturn({
        assume: labelIndexAssume,
      } as unknown as Thing);
    mockOsProvider(mockOs);

    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // and nothing shows up yet
    expect(page.root.innerHTML).toEqualHtml('<!---->');

    // when the user signed in
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => ['https://pod.example/label-index'],
    } as unknown as WebIdProfile;

    await page.waitForChanges();

    // then the button appears
    const button = withinShadow(page).getByRole('button');
    expect(button).toBeDefined();
    expect(button.textContent).toEqual('Make this findable');

    // and is working
    await userEvent.click(button);
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith({ fake: 'thing' }, expect.objectContaining({ fake: 'index' }));
  });

  it('updates thing when URI changes', async () => {
    // given a PodOS instance that yields Things for given URIs
    const mockOs = {
      store: {
        get: vi.fn(),
      },
    } as unknown as PodOS;
    when(mockOs.store.get)
      .calledWith('https://thing.example#it')
      .thenReturn({ uri: 'https://thing.example#it' } as unknown as Thing);
    when(mockOs.store.get)
      .calledWith('https://other.example#it')
      .thenReturn({ uri: 'https://other.example#it' } as unknown as Thing);
    mockOsProvider(mockOs);

    // and a make findable component for a thing
    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // and the thing matches the initial URI
    expect(page.instance.thing).toEqual({ uri: 'https://thing.example#it' });

    // when the URI attribute changes
    page.root.setAttribute('uri', 'https://other.example#it');
    // then the thing matches the new URI
    expect(page.instance.thing).toEqual({ uri: 'https://other.example#it' });
  });

  it('resets index indication when URI changes', async () => {
    // given a PodOS instance that yields Things
    const mockOs = {
      store: {
        get: vi.fn(),
      },
    } as unknown as PodOS;
    (mockOs.store.get as Mock).mockReturnValue({ fake: 'thing' });
    mockOsProvider(mockOs);

    // and a make findable component for a thing
    page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);

    // and the component is in indexed state
    page.instance.isIndexed = true;

    // when the URI attribute changes
    page.root.setAttribute('uri', 'https://other.example#it');
    // then the indexed status resets
    expect(page.instance.isIndexed).toEqual(false);
  });

  describe('multiple indexes to choose from', () => {
    let mockOs: PodOS;

    beforeEach(async () => {
      // given a user profile in the current session with a single private label index
      session.state.isLoggedIn = true;
      session.state.profile = {
        getPrivateLabelIndexes: () => ['https://pod.example/first-index', 'https://pod.example/second-index'],
      } as unknown as WebIdProfile;

      // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
      mockOs = {
        store: {
          get: vi.fn(),
        },
        addToLabelIndex: vi.fn(),
      } as unknown as PodOS;
      when(mockOs.store.get)
        .calledWith('https://thing.example#it')
        .thenReturn({ fake: 'thing' } as unknown as Thing);
      const firstIndexAssume = vi.fn();
      when(firstIndexAssume)
        .calledWith(LabelIndex)
        .thenReturn({ uri: 'https://pod.example/first-index', contains: () => false });
      when(mockOs.store.get)
        .calledWith('https://pod.example/first-index')
        .thenReturn({
          assume: firstIndexAssume,
        } as unknown as Thing);
      const secondIndexAssume = vi.fn();
      when(secondIndexAssume)
        .calledWith(LabelIndex)
        .thenReturn({ uri: 'https://pod.example/second-index', contains: () => true });
      when(mockOs.store.get)
        .calledWith('https://pod.example/second-index')
        .thenReturn({
          assume: secondIndexAssume,
        } as unknown as Thing);
      mockOsProvider(mockOs);

      // and a make findable component for a thing
      page = await render(<pos-make-findable uri="https://thing.example#it"></pos-make-findable>);
      await page.waitForChanges();
    });

    it('allows to choose the target index, if multiple exist', async () => {
      // when the button is clicked
      const button = withinShadow(page).getByRole('button');
      await userEvent.click(button);

      // then nothing is added to an index yet
      expect(mockOs.addToLabelIndex).not.toHaveBeenCalled();

      // but options show up to choose one of the indexes
      const list = withinShadow(page).getByRole('listbox');
      expect(list).toEqualHtml(`
        <sl-menu role="listbox">
          <sl-menu-item role="option" type="checkbox">
            <pos-resource uri="https://pod.example/first-index" lazy>
              <pos-label></pos-label>
            </pos-resource>
          </sl-menu-item>
          <sl-menu-item role="option" type="checkbox" checked>
            <pos-resource uri="https://pod.example/second-index" lazy>
              <pos-label></pos-label>
            </pos-resource>
          </sl-menu-item>
        </sl-menu>`);
    });

    it('add thing to the chosen label index', async () => {
      // and the page listens for index updates
      const indexUpdateListener = vi.fn();
      page.root.addEventListener('pod-os:search:index-updated', indexUpdateListener);

      // when the button is clicked
      const button = withinShadow(page).getByRole('button');
      await userEvent.click(button);

      // and an option is chosen
      const options = withinShadow(page).getAllByRole('option');
      expect(options.length).toEqual(2);
      const firstOption = options[0] as HTMLInputElement & { option: LabelIndex };
      page.root.dispatchEvent(new CustomEvent('sl-select', { detail: { item: { value: firstOption.value } } }));
      await page.waitForChanges();

      // then the thing is added to the index
      expect(mockOs.addToLabelIndex).toHaveBeenCalledWith(
        { fake: 'thing' },
        expect.objectContaining({ uri: 'https://pod.example/first-index' }),
      );
      await page.waitForChanges();

      // and the state changes to indexed
      expect(page.instance.isIndexed).toEqual(true);

      // then
      expect(indexUpdateListener).toHaveBeenCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ uri: 'https://pod.example/first-index' }) }),
      );
    });
  });
});
