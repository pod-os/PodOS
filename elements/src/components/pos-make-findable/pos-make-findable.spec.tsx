import { pressKey } from '../../test/pressKey';

jest.mock('@pod-os/core', () => ({}));

import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { PosMakeFindable } from './pos-make-findable';

import { fireEvent, screen, within } from '@testing-library/dom';
import { when } from 'jest-when';
import session from '../../store/session';
import { LabelIndex, WebIdProfile } from '@pod-os/core';

describe('pos-make-findable', () => {
  let page: SpecPage;

  afterEach(() => {
    page.rootInstance.disconnectedCallback();
    session.dispose();
  });

  it('renders a button, when logged in', async () => {
    session.state.isLoggedIn = true;
    page = await newSpecPage({
      components: [PosMakeFindable],
      supportsShadowDom: false,
      html: `<pos-make-findable uri="https://any.thing.example" />`,
    });

    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    expect(button.textContent).toEqual('Make this findable');
  });

  it('add thing to a single private label index', async () => {
    // given a user profile in the current session with a single private label index
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => ['https://pod.example/label-index'],
    } as unknown as WebIdProfile;

    // and a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      supportsShadowDom: false,
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });

    // and the page listens for index updates
    const indexUpdateListener = jest.fn();
    page.root.addEventListener('pod-os:search:index-updated', indexUpdateListener);

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: jest.fn(),
      },
      addToLabelIndex: jest.fn(),
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });
    const labelIndexAssume = jest.fn();
    when(labelIndexAssume)
      .calledWith(LabelIndex)
      .mockReturnValue({ fake: 'index', contains: () => false });
    when(mockOs.store.get).calledWith('https://pod.example/label-index').mockReturnValue({
      assume: labelIndexAssume,
    });
    // and the component received that PodOs instance
    page.rootInstance.receivePodOs(mockOs);

    // when the button is clicked
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await page.waitForChanges();

    // then the thing is added to the index
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith({ fake: 'thing' }, expect.objectContaining({ fake: 'index' }));

    // and the state changes to indexed
    expect(page.rootInstance.isIndexed).toEqual(true);

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

    // and a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: jest.fn(),
      },
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });
    const contains = jest.fn();
    const labelIndexAssume = jest.fn();
    when(labelIndexAssume).calledWith(LabelIndex).mockReturnValue({ fake: 'index', contains });
    when(mockOs.store.get).calledWith('https://pod.example/label-index').mockReturnValue({
      assume: labelIndexAssume,
    });

    // and the index already contains the URI
    when(contains).calledWith('https://thing.example#it').mockReturnValue(true);

    // and the component received that PodOs instance
    page.rootInstance.receivePodOs(mockOs);

    // then the state indicates that the URI is already indexed
    expect(page.rootInstance.isIndexed).toEqual(true);
  });

  it('emits error if updating the index fails', async () => {
    // given a user profile in the current session with a single private label index
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => ['https://pod.example/label-index'],
    } as unknown as WebIdProfile;

    // and a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      supportsShadowDom: false,
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });

    // and the page listens for error
    const errorListener = jest.fn();
    page.root.addEventListener('pod-os:error', errorListener);

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: jest.fn(),
      },
      addToLabelIndex: jest.fn(),
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });
    const labelIndexAssume = jest.fn();
    when(labelIndexAssume)
      .calledWith(LabelIndex)
      .mockReturnValue({ fake: 'index', contains: () => false });
    when(mockOs.store.get).calledWith('https://pod.example/label-index').mockReturnValue({
      assume: labelIndexAssume,
    });

    // but leads to an error when adding a thing to index
    mockOs.addToLabelIndex.mockRejectedValue(new Error('simulated error'));

    // and the component received that PodOs instance
    page.rootInstance.receivePodOs(mockOs);

    // when the button is clicked
    const button = screen.getByRole('button');
    fireEvent.click(button);
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

    // and a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      supportsShadowDom: false,
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });

    // and the page listens for index creation
    const indexCreatedListener = jest.fn();
    page.root.addEventListener('pod-os:search:index-created', indexCreatedListener);

    // and a PodOS instance that yields a Thing for the URI in question
    const mockOs = {
      store: {
        get: jest.fn(),
      },
      addToLabelIndex: jest.fn(),
      createDefaultLabelIndex: jest.fn(),
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });

    // and it is able to create a default index for the user profile
    when(mockOs.createDefaultLabelIndex)
      .calledWith(session.state.profile)
      .mockReturnValue({ fake: 'newly created default index' });

    // and the component received that PodOs instance
    page.rootInstance.receivePodOs(mockOs);

    // when the button is clicked
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await page.waitForChanges();

    // then the thing is added to the index
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith(
      { fake: 'thing' },
      expect.objectContaining({ fake: 'newly created default index' }),
    );

    // and the state changes to indexed
    expect(page.rootInstance.isIndexed).toEqual(true);

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

    // and a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      supportsShadowDom: false,
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });

    // and the page listens for error
    const errorListener = jest.fn();
    page.root.addEventListener('pod-os:error', errorListener);

    // and a PodOS instance that yields a Thing for the URI in question
    const mockOs = {
      store: {
        get: jest.fn(),
      },
      addToLabelIndex: jest.fn(),
      createDefaultLabelIndex: jest.fn(),
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });

    // but leads to an error when creating the default index
    when(mockOs.createDefaultLabelIndex)
      .calledWith(session.state.profile)
      .mockRejectedValue(new Error('simulated error'));

    // and the component received that PodOs instance
    page.rootInstance.receivePodOs(mockOs);

    // when the button is clicked
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await page.waitForChanges();

    // then an error event is emitted
    expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ detail: new Error('simulated error') }));
  });

  describe('does not show up', () => {
    it('if URI is empty', async () => {
      // given no user session
      session.state.isLoggedIn = true;
      // and a make findable component for a thing
      page = await newSpecPage({
        components: [PosMakeFindable],
        supportsShadowDom: false,
        html: `<pos-make-findable uri=""/>`,
      });
      // then nothing shows up
      expect(page.root.innerHTML).toEqualHtml('<!---->');
      page.rootInstance.disconnectedCallback();
    });

    it('when not logged in', async () => {
      // given no user session
      session.state.isLoggedIn = false;
      // and a make findable component for a thing
      page = await newSpecPage({
        components: [PosMakeFindable],
        supportsShadowDom: false,
        html: `<pos-make-findable uri="https://thing.example#it"/>`,
      });
      // then nothing shows up
      expect(page.root.innerHTML).toEqualHtml('<!---->');
      page.rootInstance.disconnectedCallback();
    });
  });

  it('can be used, after the user signed in', async () => {
    // given no user session yet
    session.state.isLoggedIn = false;
    // and a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      supportsShadowDom: false,
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });

    // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
    const mockOs = {
      store: {
        get: jest.fn(),
      },
      addToLabelIndex: jest.fn(),
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });
    const labelIndexAssume = jest.fn();
    when(labelIndexAssume)
      .calledWith(LabelIndex)
      .mockReturnValue({ fake: 'index', contains: () => false });
    when(mockOs.store.get).calledWith('https://pod.example/label-index').mockReturnValue({
      assume: labelIndexAssume,
    });
    // and the component received that PodOs instance already
    page.rootInstance.receivePodOs(mockOs);

    // and nothing shows up yet
    expect(page.root.innerHTML).toEqualHtml('<!---->');

    // when the user signed in
    session.state.isLoggedIn = true;
    session.state.profile = {
      getPrivateLabelIndexes: () => ['https://pod.example/label-index'],
    } as unknown as WebIdProfile;

    await page.waitForChanges();

    // then the button appears
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    expect(button.textContent).toEqual('Make this findable');

    // and is working
    fireEvent.click(button);
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith({ fake: 'thing' }, expect.objectContaining({ fake: 'index' }));
  });

  it('updates thing when URI changes', async () => {
    // given a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });
    // and a PodOS instance that yields Things for given URIs
    const mockOs = {
      store: {
        get: jest.fn(),
      },
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ uri: 'https://thing.example#it' });
    when(mockOs.store.get).calledWith('https://other.example#it').mockReturnValue({ uri: 'https://other.example#it' });

    // and the component received that PodOs instance already
    page.rootInstance.receivePodOs(mockOs);
    // and the thing matches the initial URI
    expect(page.rootInstance.thing).toEqual({ uri: 'https://thing.example#it' });

    // when the URI attribute changes
    page.root.setAttribute('uri', 'https://other.example#it');
    // then the thing matches the new URI
    expect(page.rootInstance.thing).toEqual({ uri: 'https://other.example#it' });
  });

  it('resets index indication when URI changes', async () => {
    // given a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });
    // and a PodOS instance that yields Things
    const mockOs = {
      store: {
        get: jest.fn(),
      },
    };
    when(mockOs.store.get).mockReturnValue({ fake: 'thing' });

    // and the component received that PodOs instance already
    page.rootInstance.receivePodOs(mockOs);
    // and the component is in indexed state
    page.rootInstance.isIndexed = true;

    // when the URI attribute changes
    page.root.setAttribute('uri', 'https://other.example#it');
    // then the indexed status resets
    expect(page.rootInstance.isIndexed).toEqual(false);
  });

  describe('multiple indexes to choose from', () => {
    let mockOs;

    beforeEach(async () => {
      // given a user profile in the current session with a single private label index
      session.state.isLoggedIn = true;
      session.state.profile = {
        getPrivateLabelIndexes: () => ['https://pod.example/first-index', 'https://pod.example/second-index'],
      } as unknown as WebIdProfile;

      // and a make findable component for a thing
      page = await newSpecPage({
        components: [PosMakeFindable],
        supportsShadowDom: false,
        html: `<pos-make-findable uri="https://thing.example#it"/>`,
      });

      // and a PodOS instance that yields Thing and LabelIndex instances for the URIs in question
      mockOs = {
        store: {
          get: jest.fn(),
        },
        addToLabelIndex: jest.fn(),
      };
      when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });
      const firstIndexAssume = jest.fn();
      when(firstIndexAssume)
        .calledWith(LabelIndex)
        .mockReturnValue({ uri: 'https://pod.example/first-index', contains: () => false });
      when(mockOs.store.get).calledWith('https://pod.example/first-index').mockReturnValue({
        assume: firstIndexAssume,
      });
      const secondIndexAssume = jest.fn();
      when(secondIndexAssume)
        .calledWith(LabelIndex)
        .mockReturnValue({ uri: 'https://pod.example/second-index', contains: () => true });
      when(mockOs.store.get).calledWith('https://pod.example/second-index').mockReturnValue({
        assume: secondIndexAssume,
      });
      // and the component received that PodOs instance
      page.rootInstance.receivePodOs(mockOs);
      await page.waitForChanges();
    });

    it('allows to choose the target index, if multiple exist', async () => {
      // given the list does not show up yet
      expect(screen.queryByRole('listbox')).toBeNull();

      // when the button is clicked
      const button = screen.getByRole('button');
      fireEvent.click(button);
      await page.waitForChanges();

      // then nothing is added to an index yet
      expect(mockOs.addToLabelIndex).not.toHaveBeenCalled();

      // but options show up to choose one of the indexes
      const list = screen.getByRole('listbox');
      expect(list).toEqualHtml(`
        <ol role="listbox">
          <li role="option">
        <label>
          <input type="checkbox">
          <pos-resource uri="https://pod.example/first-index" lazy>
            <pos-label></pos-label>
          </pos-resource>
        </label>
          </li>
          <li role="option">
        <label>
          <input checked type="checkbox">
          <pos-resource uri="https://pod.example/second-index" lazy>
            <pos-label></pos-label>
          </pos-resource>
        </label>
          </li>
        </ol>`);
    });

    it('add thing to the chosen label index', async () => {
      // and the page listens for index updates
      const indexUpdateListener = jest.fn();
      page.root.addEventListener('pod-os:search:index-updated', indexUpdateListener);

      // when the button is clicked
      const button = screen.getByRole('button');
      fireEvent.click(button);
      await page.waitForChanges();

      // and an option is chosen
      const options = screen.getAllByRole('option');
      expect(options.length).toEqual(2);
      const indexCheckbox = within(options[0]).getByRole('checkbox');
      fireEvent.change(indexCheckbox);
      await page.waitForChanges();

      // then the thing is added to the index
      expect(mockOs.addToLabelIndex).toHaveBeenCalledWith(
        { fake: 'thing' },
        expect.objectContaining({ uri: 'https://pod.example/first-index' }),
      );
      await page.waitForChanges();

      // and the options disappear
      const list = screen.queryByRole('listbox');
      expect(list).toBeNull();

      // and the state changes to indexed
      expect(page.rootInstance.isIndexed).toEqual(true);

      // then
      expect(indexUpdateListener).toHaveBeenCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ uri: 'https://pod.example/first-index' }) }),
      );
    });

    it('closes the options, if clicked elsewhere', async () => {
      // given the list does not show up yet
      expect(screen.queryByRole('listbox')).toBeNull();

      // when the button is clicked
      const button = screen.getByRole('button');
      fireEvent.click(button);
      await page.waitForChanges();

      // and then clicked elsewhere
      // @ts-ignore
      page.doc.click();
      await page.waitForChanges();

      // then nothing is added to an index
      expect(mockOs.addToLabelIndex).not.toHaveBeenCalled();

      // and the options disappear
      const list = screen.queryByRole('listbox');
      expect(list).toBeNull();
    });

    it('closes the options, if button is clicked again', async () => {
      // given the list does not show up yet
      expect(screen.queryByRole('listbox')).toBeNull();

      // when the button is clicked
      const button = screen.getByRole('button');
      fireEvent.click(button);
      await page.waitForChanges();

      // and then clicked it again
      // @ts-ignore
      fireEvent.click(button);
      await page.waitForChanges();

      // then nothing is added to an index
      expect(mockOs.addToLabelIndex).not.toHaveBeenCalled();

      // and the options disappear
      const list = screen.queryByRole('listbox');
      expect(list).toBeNull();
    });

    it('closes the options, when ESC is pressed', async () => {
      // given the list does not show up yet
      expect(screen.queryByRole('listbox')).toBeNull();

      // when the button is clicked
      const button = screen.getByRole('button');
      fireEvent.click(button);
      await page.waitForChanges();

      // and then clicked elsewhere
      // @ts-ignore
      await pressKey(page, 'Escape');

      // then the options disappear
      const list = screen.queryByRole('listbox');
      expect(list).toBeNull();
    });
  });
});
