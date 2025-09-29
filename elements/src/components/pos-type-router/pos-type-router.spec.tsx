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
        <pos-app-rdf-document></pos-app-rdf-document>
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
        <pos-app-image-viewer></pos-app-image-viewer>
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
        <pos-app-document-viewer></pos-app-document-viewer>
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
        <pos-app-document-viewer></pos-app-document-viewer>
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
      types: () => ['http://www.w3.org/ns/ldp#Resource'],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-app-generic></pos-app-generic>
      </section>
    </pos-type-router>
`);
  });
});
