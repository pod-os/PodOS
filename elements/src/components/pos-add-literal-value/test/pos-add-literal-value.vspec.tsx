import { mockResource } from '../../../test/mockResource';
import { Mock, vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';
import { Literal } from '@pod-os/core';
import { fireEvent } from '@testing-library/dom';

import '../pos-add-literal-value';
import { mockOsProvider, mockPodOS } from '../../../test/mockPodOS.vitest';

vi.mock('@pod-os/core', () => ({
  labelFromUri: (uri: string) => `fake label for ${uri}`,
}));

vi.mock('@shoelace-style/shoelace/dist/components/icon/icon.js', () => ({}));

describe('pos-add-literal-value', () => {
  it('renders nothing initially', async () => {
    const page = await renderComponent();
    expect(page.root).toBeEmptyDOMElement();
  });

  it('renders nothing, if resource is not editable', async () => {
    mockResource({
      editable: false,
    });
    const page = await renderComponent();
    await page.waitForChanges();
    expect(page.root).toBeEmptyDOMElement();
  });

  it('renders inputs, if resource is editable', async () => {
    mockResource({
      editable: true,
    });
    const page = await renderComponent();
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
        <sl-icon name="plus-circle"></sl-icon>
        <pos-select-term placeholder="Add literal"></pos-select-term>
        <input placeholder>
    `);
  });

  it('focuses the input after a term was selected', async () => {
    // given the current (editable) resource
    const editableResource = {
      editable: true,
    };
    mockResource(editableResource);
    // and a page with a pos-add-literal-value component
    const page = await renderComponent();
    const shadowRoot = page.root.shadowRoot!;
    await page.waitForChanges();

    const input = shadowRoot.querySelector('input')!;
    input.focus = vi.fn();

    // when the user selects a term
    const termSelect = shadowRoot.querySelector('pos-select-term')!;
    fireEvent(
      termSelect,
      new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
    );

    // then the input is focussed
    expect(input.focus).toHaveBeenCalled();
  });

  it('changes value and saves value', async () => {
    // given the current resource is editable
    const editableResource = {
      editable: true,
    };
    mockResource(editableResource);

    // and os is provided
    const mockOs = mockPodOS();
    mockOsProvider(mockOs);

    // and a page with a pos-add-literal-value component
    const page = await renderComponent();
    const shadowRoot = page.root.shadowRoot!;
    await page.waitForChanges();

    const input = shadowRoot.querySelector('input')!;
    input.focus = vi.fn();

    // when the user selects a term
    selectTerm(shadowRoot, 'https://schema.org/description');

    // when the user types something into the value input
    input.value = 'new value';
    fireEvent(input, new CustomEvent('input'));

    // and the value changes for good
    fireEvent(input, new CustomEvent('change'));

    await page.waitForChanges();

    // then the value is added to the property of the resource
    expect(mockOs.addPropertyValue).toHaveBeenCalledWith(
      editableResource,
      'https://schema.org/description',
      'new value',
    );

    // and the value input is cleared
    expect(input).toHaveValue('');
  });

  it('fires event after save', async () => {
    // given the current resource is editable
    const editableResource = {
      editable: true,
    };
    mockResource(editableResource);

    // and os is provided
    const mockOs = mockPodOS();
    mockOsProvider(mockOs);

    // and a page with a pos-add-literal-value component
    const page = await renderComponent();

    // and the page listens for pod-os:added-literal-value event
    const eventListener = vi.fn();
    page.root.addEventListener('pod-os:added-literal-value', eventListener);

    await page.waitForChanges();

    // when enters term and value
    selectTerm(page.root.shadowRoot!, 'https://schema.org/name');
    enterValue(page.root.shadowRoot!, 'Test value');
    await page.waitForChanges();

    // then a pod-os:added-literal-value event with the added literal is received in the listener
    const literal: Literal = {
      predicate: 'https://schema.org/name',
      label: 'fake label for https://schema.org/name',
      values: ['Test value'],
    };
    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: literal,
      }),
    );
  });

  it('fires error event and keeps inputs when save failed', async () => {
    // given the current resource is editable
    const editableResource = {
      editable: true,
    };
    mockResource(editableResource);

    // and os is provided
    const mockOs = mockPodOS();
    mockOsProvider(mockOs);

    // and a page with a pos-add-literal-value component
    const page = await renderComponent();

    // and the page listens for pod-os:error event
    const eventListener = vi.fn();
    page.root.addEventListener('pod-os:error', eventListener);

    // and saving will cause an error
    const error = new Error('fake error in addPropertyValue');
    (mockOs.addPropertyValue as Mock).mockRejectedValue(error);

    // when enters term and value
    selectTerm(page.root.shadowRoot!, 'https://schema.org/name');
    enterValue(page.root.shadowRoot!, 'Test value');
    await page.waitForChanges();

    // then a pod-os:error event with the error is received in the listener
    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: error,
      }),
    );

    // and the value input is not cleared
    expect(page.root.shadowRoot!.querySelector('input')!).toHaveValue('Test value');
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

async function renderComponent() {
  return await render(<pos-add-literal-value></pos-add-literal-value>);
}
