import { newSpecPage } from '@stencil/core/testing';
import { PosAppImageViewer } from './pos-app-image-viewer';

describe('pos-app-image-viewer', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosAppImageViewer],
      html: `<pos-app-image-viewer />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-app-image-viewer>
        <mock:shadow-root></mock:shadow-root>
      </pos-app-image-viewer>
  `);
  });

  it('renders pos-app-image-viewer after resource is received', async () => {
    const page = await newSpecPage({
      components: [PosAppImageViewer],
      html: `<pos-app-image-viewer />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      uri: 'https://resource.test/picture.png',
    });
    await page.waitForChanges();
    const image = page.root.querySelector('pos-image');
    expect(image).toEqualHtml('<pos-image src="https://resource.test/picture.png"/>');
  });
});
