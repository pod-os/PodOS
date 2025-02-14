jest.mock('@pod-os/core', () => ({}));

import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { PosMakeFindable } from './pos-make-findable';

import { fireEvent, screen } from '@testing-library/dom';
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
      html: `<pos-make-findable />`,
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
    when(labelIndexAssume).calledWith(LabelIndex).mockReturnValue({ fake: 'index' });
    when(mockOs.store.get).calledWith('https://pod.example/label-index').mockReturnValue({
      assume: labelIndexAssume,
    });
    // and the component received that PodOs instance
    page.rootInstance.receivePodOs(mockOs);

    // when the button is clicked
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // then the thing is added to the index
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith({ fake: 'thing' }, { fake: 'index' });
  });

  it('does not show up, when not logged in', async () => {
    // given no user session
    session.state.isLoggedIn = false;
    // and a make findable component for a thing
    page = await newSpecPage({
      components: [PosMakeFindable],
      html: `<pos-make-findable uri="https://thing.example#it"/>`,
    });
    // then nothing shows up
    expect(page.root).toEqualHtml('<pos-make-findable uri="https://thing.example#it"/>');
    page.rootInstance.disconnectedCallback();
  });

  it('can be used, after the user signed in', async () => {
    // given no user session yet
    session.state.isLoggedIn = false;
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
      addToLabelIndex: jest.fn(),
    };
    when(mockOs.store.get).calledWith('https://thing.example#it').mockReturnValue({ fake: 'thing' });
    const labelIndexAssume = jest.fn();
    when(labelIndexAssume).calledWith(LabelIndex).mockReturnValue({ fake: 'index' });
    when(mockOs.store.get).calledWith('https://pod.example/label-index').mockReturnValue({
      assume: labelIndexAssume,
    });
    // and the component received that PodOs instance already
    page.rootInstance.receivePodOs(mockOs);

    // and nothing shows up yet
    expect(page.root).toEqualHtml('<pos-make-findable uri="https://thing.example#it"/>');

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
    expect(mockOs.addToLabelIndex).toHaveBeenCalledWith({ fake: 'thing' }, { fake: 'index' });
  });
});
