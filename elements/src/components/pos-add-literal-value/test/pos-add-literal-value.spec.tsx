jest.mock('@pod-os/core', () => ({
  labelFromUri: uri => `fake label for ${uri}`,
}));

import { Literal } from '@pod-os/core';
import { newSpecPage } from '@stencil/core/testing';
import { when } from 'jest-when';
import { PosAddLiteralValue } from '../pos-add-literal-value';
import { fireEvent } from '@testing-library/dom';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

describe('pos-add-literal-value', () => {
  it('renders nothing initially', async () => {
    const page = await newSpecPage({
      components: [PosAddLiteralValue],
      html: `<pos-add-literal-value></pos-add-literal-value>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-add-literal-value>
        <mock:shadow-root>
        </mock:shadow-root>
      </pos-add-literal-value>
    `);
  });

  it('renders nothing, if resource is not editable', async () => {
    const page = await newSpecPage({
      components: [PosAddLiteralValue],
      html: `<pos-add-literal-value></pos-add-literal-value>`,
    });
    page.rootInstance.receiveResource({
      editable: false,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-add-literal-value>
        <mock:shadow-root>
        </mock:shadow-root>
      </pos-add-literal-value>
    `);
  });

  it('renders inputs, if resource is editable', async () => {
    const page = await newSpecPage({
      components: [PosAddLiteralValue],
      html: `<pos-add-literal-value></pos-add-literal-value>`,
    });
    page.rootInstance.receiveResource({
      editable: true,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-add-literal-value>
        <mock:shadow-root>
            <sl-icon name="plus-circle"></sl-icon>
            <pos-select-term placeholder="Add literal"></pos-select-term>
            <input placeholder="" />
        </mock:shadow-root>
      </pos-add-literal-value>
    `);
  });

  it('focusses the input after a term was selected', async () => {
    // given a page with a pos-add-literal-value component
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosAddLiteralValue],
      html: `<pos-add-literal-value></pos-add-literal-value>`,
    });

    // and the component received a PodOs instance
    const mockOs = {
      addPropertyValue: jest.fn(),
    };
    page.rootInstance.receivePodOs(mockOs);

    // and the current (editable) resource
    const mockResource = {
      editable: true,
    };
    page.rootInstance.receiveResource(mockResource);

    await page.waitForChanges();

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

  it('changes value and saves value', async () => {
    // given a page with a pos-add-literal-value component
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosAddLiteralValue],
      html: `<pos-add-literal-value></pos-add-literal-value>`,
    });

    // and the component received a PodOs instance
    const mockOs = {
      addPropertyValue: jest.fn(),
    };
    page.rootInstance.receivePodOs(mockOs);

    // and the current (editable) resource
    const mockResource = {
      editable: true,
    };
    page.rootInstance.receiveResource(mockResource);

    await page.waitForChanges();

    const input = page.root.querySelector('input');
    input.focus = jest.fn();

    // when the user selects a term
    const termSelect = page.root.querySelector('pos-select-term');
    fireEvent(
      termSelect,
      new CustomEvent('pod-os:term-selected', {
        detail: { uri: 'https://schema.org/description' },
      }),
    );
    expect(page.rootInstance.selectedTermUri).toBe('https://schema.org/description');

    // when the user types something into the value input
    input.value = 'new value';
    fireEvent(input, new CustomEvent('input'));
    expect(page.rootInstance.currentValue).toBe('new value');

    // and the value changes for good
    fireEvent(input, new CustomEvent('change'));

    await page.waitForChanges();

    // then the value is added to the property of the resource
    expect(mockOs.addPropertyValue).toHaveBeenCalledWith(mockResource, 'https://schema.org/description', 'new value');

    // and the value input is cleared
    expect(page.rootInstance.currentValue).toBe('');
  });

  it('fires event after save', async () => {
    // given a page with a pos-add-literal-value component
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosAddLiteralValue],
      html: `<pos-add-literal-value></pos-add-literal-value>`,
    });

    // and the page listens for pod-os:added-literal-value event
    const eventListener = jest.fn();
    page.root.addEventListener('pod-os:added-literal-value', eventListener);

    // and the component received a PodOs instance
    const mockOs = {
      addPropertyValue: jest.fn(),
    };
    page.rootInstance.receivePodOs(mockOs);

    // and the current (editable) resource
    const mockResource = {
      editable: true,
    };
    page.rootInstance.receiveResource(mockResource);

    await page.waitForChanges();

    // when save is called
    page.rootInstance.selectedTermUri = 'https://schema.org/name';
    page.rootInstance.currentValue = 'Test value';
    await page.rootInstance.save();

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
    // given a page with a pos-add-literal-value component
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosAddLiteralValue],
      html: `<pos-add-literal-value></pos-add-literal-value>`,
    });

    // and the page listens for pod-os:error event
    const eventListener = jest.fn();
    page.root.addEventListener('pod-os:error', eventListener);

    // and the component received a PodOs instance
    const mockOs = {
      addPropertyValue: jest.fn(),
    };
    page.rootInstance.receivePodOs(mockOs);

    // and the current (editable) resource
    const mockResource = {
      editable: true,
    };
    page.rootInstance.receiveResource(mockResource);
    await page.waitForChanges();

    // and saving will cause an error
    const error = new Error('fake error in addPropertyValue');
    when(mockOs.addPropertyValue).mockRejectedValue(error);

    // when save is called
    page.rootInstance.selectedTermUri = 'https://schema.org/name';
    page.rootInstance.currentValue = 'Test value';
    await page.rootInstance.save();

    // then a pod-os:error event with the error is received in the listener
    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: error,
      }),
    );

    // and the value input is not cleared
    expect(page.rootInstance.selectedTermUri).toBe('https://schema.org/name');
    expect(page.rootInstance.currentValue).toBe('Test value');
  });
});
