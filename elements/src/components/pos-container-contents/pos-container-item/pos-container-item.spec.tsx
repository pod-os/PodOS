import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';
import './pos-container-item';
import { mockResource } from '../../../test/mockResource';
import { RdfType } from '@pod-os/core';

vi.mock('@pod-os/core', () => ({}));

describe('pos-container-item', () => {
  it('only shows the body initially', async () => {
    const page = await render(<pos-container-item>item body</pos-container-item>);
    expect(page.root.innerHTML).toEqualHtml('item body');
  });

  it('renders item with document icon for ldp resources', async () => {
    mockResource({
      types: () => [
        {
          uri: 'http://www.w3.org/ns/ldp#Resource',
        } as unknown as RdfType,
      ],
    });
    const page = await render(<pos-container-item>file name</pos-container-item>);

    await page.waitForChanges();

    const icon = page.root.shadowRoot!.querySelector('sl-icon')!;
    expect(icon).toEqualAttribute('name', 'file-earmark');
    expect(page.root.innerHTML).toEqualHtml('file name');
  });

  it('renders item with folder icon for ldp containers', async () => {
    mockResource({
      types: () => [
        {
          uri: 'http://www.w3.org/ns/ldp#Container',
        } as unknown as RdfType,
      ],
    });
    const page = await render(<pos-container-item>folder name</pos-container-item>);
    await page.waitForChanges();

    const icon = page.root.shadowRoot!.querySelector('sl-icon')!;
    expect(icon).toEqualAttribute('name', 'folder2');
    expect(page.root.innerHTML).toEqualHtml('folder name');
  });
});
