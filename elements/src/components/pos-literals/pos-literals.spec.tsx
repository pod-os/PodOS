import { describe, expect, h, it, render } from '@stencil/vitest';

import { fireEvent, getByRole, getByText } from '@testing-library/dom';

import './pos-literals';
import { Literal } from '@pod-os/core';
import { mockResource } from '../../test/mockResource';
import { withinShadow } from '../../test/withinShadow';

describe('pos-literals', () => {
  it('are empty initially, but include option to add one', async () => {
    const page = await render(<pos-literals></pos-literals>);
    expect(page.root.shadowRoot).toEqualHtml('<pos-add-literal-value></pos-add-literal-value>');
  });

  it('renders single predicate and value', async () => {
    mockResource({
      literals: () => [
        {
          predicate: 'http://schema.org/name',
          label: 'name',
          values: ['Alice'],
        },
      ],
    });
    const page = await render(<pos-literals></pos-literals>);
    await page.waitForChanges();

    const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

    expect(getByRole(el, 'definition')).toEqualText('Alice');
    const term = getByRole(el, 'term');
    const predicate = term.querySelector('pos-predicate');
    expect(predicate).toEqualHtml('<pos-predicate uri="http://schema.org/name" label="name"></pos-predicate>');
  });

  it('renders multiple predicates and values', async () => {
    mockResource({
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
    const page = await render(<pos-literals></pos-literals>);
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
    mockResource({
      literals: () => [],
    });
    const page = await render(<pos-literals></pos-literals>);
    await page.waitForChanges();

    // when
    const input = page.root.shadowRoot!.querySelector('pos-add-literal-value')!;
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
    expect(withinShadow(page).getByText('Alice')).toBeDefined();
    const name = page.root.shadowRoot!.querySelector('pos-predicate[uri="https://schema.org/name"]');
    expect(name).toEqualAttribute('label', 'name');
  });

  it('adds newly added predicate value to the existing list without duplicating the predicate', async () => {
    // given
    mockResource({
      literals: () => [
        {
          predicate: 'https://schema.org/name',
          label: 'name',
          values: ['Alice'],
        },
      ],
    });
    const page = await render(<pos-literals></pos-literals>);
    await page.waitForChanges();

    // when
    const input = page.root.shadowRoot!.querySelector('pos-add-literal-value')!;
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
    expect(withinShadow(page).getByText('Alice')).toBeDefined();
    expect(withinShadow(page).getByText('Bernadette')).toBeDefined();
    const name = page.root.shadowRoot!.querySelectorAll('pos-predicate[uri="https://schema.org/name"]');
    expect(name).toHaveLength(1);
  });
});
