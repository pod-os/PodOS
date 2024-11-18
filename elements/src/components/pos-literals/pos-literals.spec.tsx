import { newSpecPage } from '@stencil/core/testing';

import { fireEvent, getAllByText, getByText } from '@testing-library/dom';

import { PosLiterals } from './pos-literals';
import { Literal } from '@pod-os/core';

describe('pos-literals', () => {
  it('are empty initially, but include option to add one', async () => {
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-literals>
        <mock:shadow-root>
          <pos-add-literal-value />
        </mock:shadow-root>
      </pos-literals>
  `);
  });

  it('renders single predicate and value', async () => {
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
    });
    await page.rootInstance.receiveResource({
      literals: () => [
        {
          predicate: 'http://schema.org/name',
          label: 'name',
          values: ['Alice'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    const predicate = el.querySelector('pos-predicate');
    expect(predicate).toEqualHtml('<pos-predicate uri="http://schema.org/name" label="name"/>');
  });

  it('renders multiple predicates and values', async () => {
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
    });
    await page.rootInstance.receiveResource({
      literals: () => [
        {
          predicate: 'http://schema.org/name',
          label: 'name',
          values: ['Alice', 'Bernadette'],
        },
        {
          predicate: 'http://schema.org/description',
          label: 'description',
          values: ['the description'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    expect(getByText(el, 'Bernadette')).toBeDefined();
    const name = el.querySelector('pos-predicate[uri="http://schema.org/name"]');
    expect(name).toEqualAttribute('label', 'name');

    expect(getByText(el, 'the description')).toBeDefined();
    const description = el.querySelector('pos-predicate[uri="http://schema.org/description"]');
    expect(description).toEqualAttribute('label', 'description');
  });

  it('adds newly added predicate to the list', async () => {
    // given
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      literals: () => [],
    });
    await page.waitForChanges();

    // when
    const input = page.root.querySelector('pos-add-literal-value');
    const literal: Literal = {
      predicate: 'https://schema.org/name',
      label: 'name',
      values: ['Alice'],
    };
    fireEvent(
      input,
      new CustomEvent('pod-os:added-literal-value', {
        detail: literal,
      }),
    );

    await page.waitForChanges();

    // then
    expect(getByText(page.root, 'Alice')).toBeDefined();
    const name = page.root.querySelector('pos-predicate[uri="https://schema.org/name"]');
    expect(name).toEqualAttribute('label', 'name');
  });

  it('adds newly added predicate value to the existing list without duplicating the predicate', async () => {
    // given
    const page = await newSpecPage({
      components: [PosLiterals],
      html: `<pos-literals />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      literals: () => [
        {
          predicate: 'https://schema.org/name',
          label: 'name',
          values: ['Alice'],
        },
      ],
    });
    await page.waitForChanges();

    // when
    const input = page.root.querySelector('pos-add-literal-value');
    const literal: Literal = {
      predicate: 'https://schema.org/name',
      label: 'name',
      values: ['Bernadette'],
    };
    fireEvent(
      input,
      new CustomEvent('pod-os:added-literal-value', {
        detail: literal,
      }),
    );

    await page.waitForChanges();

    // then
    expect(getByText(page.root, 'Alice')).toBeDefined();
    expect(getByText(page.root, 'Bernadette')).toBeDefined();
    const name = page.root.querySelectorAll('pos-predicate[uri="https://schema.org/name"]');
    expect(name).toHaveLength(1);
  });
});
