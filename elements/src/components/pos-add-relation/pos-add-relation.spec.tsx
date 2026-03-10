jest.mock('../events/useResource');
import { mockPodOS } from '../../test/mockPodOS';

import { newSpecPage } from '@stencil/core/testing';
import { PosAddRelation } from './pos-add-relation';
import { useResource } from '../events/useResource';
import { when } from 'jest-when';

import { Thing } from '@pod-os/core';
import { fireEvent } from '@testing-library/dom';

function mockResource(thing: Partial<Thing> = {}) {
  when(useResource).mockResolvedValue(thing as unknown as Thing);
}

describe('pos-add-relation', () => {
  beforeEach(() => {
    mockPodOS();
    mockResource();
  });

  it('renders inputs if resource is editable', async () => {
    mockResource({ editable: true } as unknown as Thing);
    const page = await newSpecPage({
      components: [PosAddRelation],
      html: `<pos-add-relation />`,
      supportsShadowDom: false,
    });

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
    await page.waitForChanges();
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
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosAddRelation],
      html: `<pos-add-relation></pos-add-relation>`,
    });

    // and the input can be focused
    const input = page.root.querySelector('input');
    input.focus = jest.fn();

    // when the user selects a term
    const termSelect = page.root.querySelector('pos-select-term');
    fireEvent(
      termSelect,
      new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
    );

    // then the input is focussed
    expect(input.focus).toHaveBeenCalled();
  });
});
