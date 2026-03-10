jest.mock('../events/useResource');
import { mockPodOS } from '../../test/mockPodOS';

import { newSpecPage } from '@stencil/core/testing';
import { PosAddRelation } from './pos-add-relation';
import { useResource } from '../events/useResource';
import { when } from 'jest-when';

import { PodOS, Thing } from '@pod-os/core';
import { fireEvent } from '@testing-library/dom';

function mockResource(thing: Partial<Thing> = {}) {
  when(useResource).mockResolvedValue(thing as unknown as Thing);
}

describe('pos-add-relation', () => {
  let os: PodOS;
  beforeEach(() => {
    os = mockPodOS();
    mockResource();
  });

  async function render() {
    const page = await newSpecPage({
      components: [PosAddRelation],
      html: `<pos-add-relation />`,
      supportsShadowDom: false,
    });
    const input = page.root.querySelector('input');
    input.focus = jest.fn();
    return page;
  }

  it('renders inputs if resource is editable', async () => {
    mockResource({ editable: true } as unknown as Thing);
    const page = await render();

    expect(page.root).toEqualHtml(`
      <pos-add-relation>
        <sl-icon name="plus-circle"></sl-icon>
        <pos-select-term placeholder="Add relation"></pos-select-term>
        <input type="url" aria-label="URI" placeholder="">
      </pos-add-relation>
    `);
  });

  it('renders nothing, if resource is not editable', async () => {
    mockResource({
      editable: false,
    });
    const page = await newSpecPage({
      components: [PosAddRelation],
      html: `<pos-add-relation></pos-add-relation>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-add-relation>
        <mock:shadow-root>
        </mock:shadow-root>
      </pos-add-relation>
    `);
  });

  it('focuses the input after a term was selected', async () => {
    // given the resource in context is editable
    mockResource({ editable: true });

    // and a page with a pos-add-relation component
    const page = await render();

    // when the user selects a term
    const termSelect = page.root.querySelector('pos-select-term');
    fireEvent(
      termSelect,
      new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
    );

    // then the input is focussed
    expect(page.root.querySelector('input').focus).toHaveBeenCalled();
  });

  it('adds the relation after URI has been entered', async () => {
    // given the resource in context is editable
    const thing = { editable: true, fake: 'thing' };
    mockResource(thing);

    // and a page with a pos-add-relation component
    const page = await render();

    // and the user selected a term
    const termSelect = page.root.querySelector('pos-select-term');
    fireEvent(
      termSelect,
      new CustomEvent('pod-os:term-selected', { detail: { uri: 'http://xmlns.com/foaf/0.1/knows' } }),
    );

    // when the user enters a URI
    const input = page.root.querySelector('input');
    fireEvent.change(input, { target: { value: 'https://alice.test/profile/card#me' } });

    // then the relation is added
    expect(os.addRelation).toHaveBeenCalledWith(
      thing,
      'http://xmlns.com/foaf/0.1/knows',
      'https://alice.test/profile/card#me',
    );
  });
});
