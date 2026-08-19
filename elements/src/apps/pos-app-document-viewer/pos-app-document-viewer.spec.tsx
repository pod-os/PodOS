import { describe, expect, h, it, render } from '@stencil/vitest';

import './pos-app-document-viewer';
import { mockResource } from '../../test/mockResource';
import { Thing } from '@pod-os/core';

describe('pos-app-document-viewer', () => {
  it('is empty initially', async () => {
    const page = await renderPage();
    expect(page.root.shadowRoot).toEqualHtml('');
  });

  it('renders a download link after resource is received', async () => {
    mockResource({
      uri: 'https://resource.test/document.pdf',
    } as unknown as Thing);
    const page = await renderPage();
    await page.waitForChanges();
    const document = page.root.shadowRoot!.querySelector('pos-document');
    expect(document).toEqualHtml('<pos-document src="https://resource.test/document.pdf"></pos-document>');
  });
});

async function renderPage() {
  return await render(<pos-app-document-viewer />);
}
