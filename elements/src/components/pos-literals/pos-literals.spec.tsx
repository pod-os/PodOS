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
          values: ['Alice'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    expect(getByText(el, 'http://schema.org/name')).toBeDefined();
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
          values: ['Alice', 'Bernadette'],
        },
        {
          predicate: 'http://schema.org/description',
          values: ['the description'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByText(el, 'Alice')).toBeDefined();
    expect(getByText(el, 'Bernadette')).toBeDefined();
    expect(getByText(el, 'http://schema.org/name')).toBeDefined();

    expect(getByText(el, 'the description')).toBeDefined();
    expect(getByText(el, 'http://schema.org/description')).toBeDefined();
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
    expect(getByText(page.root, 'https://schema.org/name')).toBeDefined();
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
          values: ['Alice'],
        },
      ],
    });
    await page.waitForChanges();

    // when
    const input = page.root.querySelector('pos-add-literal-value');
    const literal: Literal = {
      predicate: 'https://schema.org/name',
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
    expect(getAllByText(page.root, 'https://schema.org/name')).toHaveLength(1);
  });
});
