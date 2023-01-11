import { newSpecPage } from '@stencil/core/testing';
import { PosAppPdfViewer } from './pos-app-pdf-viewer';

describe('pos-app-pdf-viewer', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosAppPdfViewer],
      html: `<pos-app-pdf-viewer />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-app-pdf-viewer>
        <mock:shadow-root></mock:shadow-root>
      </pos-app-pdf-viewer>
  `);
  });

  it('renders a download link after resource is received', async () => {
    const page = await newSpecPage({
      components: [PosAppPdfViewer],
      html: `<pos-app-pdf-viewer />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      uri: 'https://resource.test/document.pdf',
    });
    await page.waitForChanges();
    const pdf = page.root.querySelector('pos-pdf');
    expect(pdf).toEqualHtml('<pos-pdf src="https://resource.test/document.pdf" />');
  });
});