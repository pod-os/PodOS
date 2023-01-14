import { newSpecPage } from '@stencil/core/testing';
import { PosAppDocumentViewer } from './pos-app-document-viewer';

describe('pos-app-document-viewer', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosAppDocumentViewer],
      html: `<pos-app-document-viewer />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-app-document-viewer>
        <mock:shadow-root></mock:shadow-root>
      </pos-app-document-viewer>
  `);
  });

  it('renders a download link after resource is received', async () => {
    const page = await newSpecPage({
      components: [PosAppDocumentViewer],
      html: `<pos-app-document-viewer />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      uri: 'https://resource.test/document.pdf',
    });
    await page.waitForChanges();
    const document = page.root.querySelector('pos-document');
    expect(document).toEqualHtml('<pos-document src="https://resource.test/document.pdf" />');
  });
});
