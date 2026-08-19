import { render, h, describe, it, expect } from '@stencil/vitest';
import { Subject } from 'rxjs';

import './pos-label';
import { Thing } from '@pod-os/core';
import { mockResource } from '../../test/mockResource';

describe('pos-label', () => {
  it('is empty initially', async () => {
    const { root } = await render(<pos-label></pos-label>);
    expect(root).toEqualHtml(`
      <pos-label class="hydrated">
        <mock:shadow-root></mock:shadow-root>
      </pos-label>
  `);
  });

  it('renders label from resource', async () => {
    const observedLabel$ = mockReceiveResourceWithLabel();
    const { root, waitForChanges } = await render(<pos-label></pos-label>);

    observedLabel$.next('Test Resource');
    await waitForChanges();
    expect(root.shadowRoot).toEqualHtml(`
        Test Resource
    `);
  });

  it('updates label when changed', async () => {
    const observedLabel$ = mockReceiveResourceWithLabel();
    const { root, waitForChanges } = await render(<pos-label></pos-label>);

    observedLabel$.next('Test Resource');
    await waitForChanges();
    expect(root.shadowRoot).toEqualHtml(`Test Resource`);

    observedLabel$.next('Test Resource 2');
    await waitForChanges();
    expect(root.shadowRoot).toEqualHtml(`Test Resource 2`);
  });

  function mockReceiveResourceWithLabel() {
    const observedLabel$ = new Subject<string>();

    mockResource({
      observeLabel: () => observedLabel$,
    } as unknown as Thing);
    return observedLabel$;
  }
});
