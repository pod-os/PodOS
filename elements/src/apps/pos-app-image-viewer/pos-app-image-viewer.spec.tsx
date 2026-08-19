import { describe, expect, h, it, render } from '@stencil/vitest';

import './pos-app-image-viewer';
import { mockResource } from '../../test/mockResource';
import { Thing } from '@pod-os/core';

describe('pos-app-image-viewer', () => {
  it('is empty initially', async () => {
    const page = await render(<pos-app-image-viewer></pos-app-image-viewer>);
    expect(page.root.shadowRoot).toEqualHtml('');
  });

  it('renders pos-image after resource is received', async () => {
    mockResource({
      uri: 'https://resource.test/picture.png',
    } as unknown as Thing);

    const page = await render(<pos-app-image-viewer></pos-app-image-viewer>);

    await page.waitForChanges();
    const image = page.root.shadowRoot!.querySelector('pos-image');
    expect(image).toEqualHtml('<pos-image src="https://resource.test/picture.png"></pos-image>');
  });
});
