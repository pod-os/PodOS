import { newSpecPage } from '@stencil/core/testing';
import { PosAddLiteralValue } from '../pos-add-literal-value';
import { fireEvent } from '@testing-library/dom';

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
          <pos-select-term></pos-select-term>
          <ion-input placeholder="Enter value"></ion-input>
        </mock:shadow-root>
      </pos-add-literal-value>
    `);
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

    // when the user selects a term
    const termSelect = page.root.querySelector('pos-select-term');
    fireEvent(termSelect, new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }));
    expect(page.rootInstance.selectedTermUri).toBe('https://schema.org/description');

    // when the user types something into the value input
    const input = page.root.querySelector('ion-input');
    fireEvent(input, new CustomEvent('ionChange', { detail: { value: 'new value' } }));
    expect(page.rootInstance.currentValue).toBe('new value');

    // and the value changes for good
    fireEvent(input, new CustomEvent('change'));

    // then the value is added to the property of the resource
    expect(mockOs.addPropertyValue).toHaveBeenCalledWith(mockResource, 'https://schema.org/description', 'new value');

    // and the value input is cleared
    expect(page.rootInstance.currentValue).toBe('');
  });
});
