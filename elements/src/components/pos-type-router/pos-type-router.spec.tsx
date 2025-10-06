jest.mock('@pod-os/core', () => ({}));

import { newSpecPage } from '@stencil/core/testing';

import { PosTypeRouter } from './pos-type-router';

describe('pos-type-router', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: true,
    });
    expect(page.root).toEqualHtml(`
      <pos-type-router>
        <mock:shadow-root></mock:shadow-root>
      </pos-type-router>
  `);
  });

  it('renders document app for rdf documents', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [{ uri: 'http://www.w3.org/2007/ont/link#RDFDocument', label: 'RdfDocument' }],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-rdf-document class="tool visible"></pos-app-rdf-document>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('renders image viewer for image resource', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [{ uri: 'http://purl.org/dc/terms/Image', label: 'Image' }],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-image-viewer class="tool visible"></pos-app-image-viewer>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('renders document viewer for pdf resource', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
        { uri: 'http://www.w3.org/ns/iana/media-types/application/pdf#Resource', label: 'Resource' },
      ],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-document-viewer class="tool visible"></pos-app-document-viewer>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('renders document viewer for generic document resource', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [{ uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' }],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-document-viewer class="tool visible"></pos-app-document-viewer>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('renders generic app for ldp resources', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [{ uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' }],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('renders the selected tool and updates query param', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
      url: 'https://pod-os.test/container/file',
    });
    const historySpy = jest.spyOn(page.win.history, 'replaceState');

    await page.rootInstance.receiveResource({
      types: () => [
        { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
        { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
      ],
    });
    await page.waitForChanges();

    page.root.dispatchEvent(
      new CustomEvent('pod-os:tool-selected', {
        detail: { element: 'pos-app-generic' },
      }),
    );
    await page.waitForChanges();

    expect(historySpy).toHaveBeenCalledWith({}, '', 'https://pod-os.test/container/file?tool=pos-app-generic');

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools transition">
          <pos-app-document-viewer class="tool hidden"></pos-app-document-viewer>
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('renders selected tool, if given as URI param', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
      url: 'https://pod.test/container/file?tool=pos-app-generic',
    });
    await page.rootInstance.receiveResource({
      types: () => [
        { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
        { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
      ],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('switches from old to new tool', async () => {
    // given the document viewer is rendered for a resource
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
      url: 'https://pod-os.test/container/file',
    });

    await page.rootInstance.receiveResource({
      types: () => [
        { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
        { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
      ],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-document-viewer class="tool visible"></pos-app-document-viewer>
        </div>
      </section>
    </pos-type-router>
`);

    // when the user switches to the generic tool
    page.root.dispatchEvent(
      new CustomEvent('pod-os:tool-selected', {
        detail: { element: 'pos-app-generic' },
      }),
    );
    await page.waitForChanges();

    // Then the generic tool is showing up, while the document viewer gets hidden
    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools transition">
          <pos-app-document-viewer class="hidden tool"></pos-app-document-viewer>
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
    </pos-type-router>
`);

    // when the animation ends
    const documentViewer = page.root.querySelector('.transition');
    documentViewer.dispatchEvent(new CustomEvent('animationend'));
    await page.waitForChanges();

    // then the document viewer is removed from DOM
    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
    </pos-type-router>
`);
  });
});
