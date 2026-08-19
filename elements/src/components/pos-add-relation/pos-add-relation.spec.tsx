import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import { useResource } from '../events/useResource';

import { PodOS, Relation, Thing } from '@pod-os/core';
import { fireEvent } from '@testing-library/dom';
import './pos-add-relation';

vi.mock('../events/useResource');
vi.mock('@pod-os/core', () => ({
  labelFromUri: (uri: string) => `fake label for ${uri}`,
}));

describe('pos-add-relation', () => {
  let os: PodOS;
  beforeEach(() => {
    os = mockPodOS();
    mockResource();
  });

  async function renderComponent() {
    const page = await render(<pos-add-relation></pos-add-relation>);
    const input = page.root.shadowRoot!.querySelector('input')!;
    input.focus = vi.fn();
    return page;
  }

  it('renders inputs if resource is editable', async () => {
    mockResource({ editable: true } as unknown as Thing);
    const page = await renderComponent();

    expect(page.root.shadowRoot).toEqualHtml(`
        <sl-icon name="plus-circle"></sl-icon>
        <pos-select-term placeholder="Add relation"></pos-select-term>
        <input type="url" aria-label="URI" placeholder>
    `);
  });

  it('renders nothing, if resource is not editable', async () => {
    mockResource({
      editable: false,
    });
    const page = await render(<pos-add-relation></pos-add-relation>);
    expect(page.root).toBeEmptyDOMElement();
  });

  it('focuses the input after a term was selected', async () => {
    // given the resource in context is editable
    mockResource({ editable: true });

    // and a page with a pos-add-relation component
    const page = await renderComponent();

    // when the user selects a term
    const termSelect = page.root.shadowRoot!.querySelector('pos-select-term')!;
    fireEvent(
      termSelect,
      new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
    );

    // then the input is focussed
    expect(page.root.shadowRoot!.querySelector('input')!.focus).toHaveBeenCalled();
  });

  it('adds the relation after URI has been entered', async () => {
    // given the resource in context is editable
    const thing = { editable: true, fake: 'thing' };
    mockResource(thing);

    // and a page with a pos-add-relation component
    const page = await renderComponent();

    // and the user selected a term
    selectTerm(page.root.shadowRoot!, 'http://xmlns.com/foaf/0.1/knows');

    // when the user enters a URI
    enterValue(page.root.shadowRoot!, 'https://alice.test/profile/card#me');

    // then the relation is added
    expect(os.addRelation).toHaveBeenCalledWith(
      thing,
      'http://xmlns.com/foaf/0.1/knows',
      'https://alice.test/profile/card#me',
    );
    await page.waitForChanges();

    // and the value input is cleared
    const input = page.root.shadowRoot!.querySelector('input')!;
    expect(input).toHaveValue('');
  });

  it('fires event after save', async () => {
    // given the resource in context is editable
    const thing = { editable: true, fake: 'thing' };
    mockResource(thing);

    // and a page with a pos-add-relation component
    const page = await render(<pos-add-relation></pos-add-relation>);

    // and the page listens for pod-os:added-relation events
    const eventListener = vi.fn();
    page.root.addEventListener('pod-os:added-relation', eventListener);

    // when relation is added
    selectTerm(page.root.shadowRoot!, 'http://xmlns.com/foaf/0.1/knows');
    enterValue(page.root.shadowRoot!, 'https://alice.test/profile/card#me');
    await page.waitForChanges();

    // then a pod-os:added-relation event with the added relation is received in the listener
    const relation: Relation = {
      predicate: 'http://xmlns.com/foaf/0.1/knows',
      label: 'fake label for http://xmlns.com/foaf/0.1/knows',
      uris: ['https://alice.test/profile/card#me'],
    };

    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: relation,
      }),
    );
  });

  it('fires error event and keeps inputs when save failed', async () => {
    // given the resource in context is editable
    const thing = { editable: true, fake: 'thing' };
    mockResource(thing);

    // and a page with a pos-add-relation component
    const page = await render(<pos-add-relation></pos-add-relation>);

    // and the page listens for pod-os:error event
    const eventListener = vi.fn();
    page.root.addEventListener('pod-os:error', eventListener);

    // and saving will cause an error
    const error = new Error('fake error in addPropertyValue');
    (os.addRelation as Mock).mockRejectedValue(error);

    // when relation is added
    selectTerm(page.root.shadowRoot!, 'http://xmlns.com/foaf/0.1/knows');
    enterValue(page.root.shadowRoot!, 'https://alice.test/profile/card#me');
    await page.waitForChanges();

    // then a pod-os:error event with the error is received in the listener
    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: error,
      }),
    );

    // and the value input is not cleared
    const input = page.root.shadowRoot!.querySelector('input')!;
    expect(input).toHaveValue('https://alice.test/profile/card#me');
  });
});

function selectTerm(shadowRoot: ShadowRoot, termUri: string) {
  const termSelect = shadowRoot.querySelector('pos-select-term')!;
  fireEvent(
    termSelect,
    new CustomEvent('pod-os:term-selected', {
      detail: { uri: termUri },
    }),
  );
}

function enterValue(shadowRoot: ShadowRoot, value: string) {
  const input = shadowRoot.querySelector('input')!;
  input.value = value;
  fireEvent(input, new CustomEvent('input'));
  fireEvent(input, new CustomEvent('change'));
}

function mockResource(thing: Partial<Thing> = {}) {
  (useResource as Mock).mockResolvedValue(thing as unknown as Thing);
}
