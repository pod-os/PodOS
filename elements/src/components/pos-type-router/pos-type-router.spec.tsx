import { describe, expect, h, it, render } from '@stencil/vitest';
import { vi } from 'vitest';

import './pos-type-router';

vi.mock('@pod-os/core', () => ({}));

describe('pos-type-router', () => {
  it('is empty initially', async () => {
    const page = await render(<pos-type-router></pos-type-router>);
    expect(page.root).toBeEmptyDOMElement();
  });

  it('renders document app for rdf documents', async () => {
    const page = await render(<pos-type-router></pos-type-router>);
    await page.instance.receiveResource({
      types: () => [{ uri: 'http://www.w3.org/2007/ont/link#RDFDocument', label: 'RdfDocument' }],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-rdf-document class="tool visible"></pos-app-rdf-document>
        </div>
      </section>
`);
  });

  it('renders image viewer for image resource', async () => {
    const page = await render(<pos-type-router></pos-type-router>);
    await page.instance.receiveResource({
      types: () => [{ uri: 'http://purl.org/dc/terms/Image', label: 'Image' }],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-image-viewer class="tool visible"></pos-app-image-viewer>
        </div>
      </section>
`);
  });

  it('renders document viewer for pdf resource', async () => {
    const page = await render(<pos-type-router></pos-type-router>);
    await page.instance.receiveResource({
      types: () => [
        { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
        { uri: 'http://www.w3.org/ns/iana/media-types/application/pdf#Resource', label: 'Resource' },
      ],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-document-viewer class="tool visible"></pos-app-document-viewer>
        </div>
      </section>
`);
  });

  it('renders document viewer for generic document resource', async () => {
    const page = await render(<pos-type-router></pos-type-router>);
    await page.instance.receiveResource({
      types: () => [{ uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' }],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-document-viewer class="tool visible"></pos-app-document-viewer>
        </div>
      </section>
`);
  });

  it('renders generic app for ldp resources', async () => {
    const page = await render(<pos-type-router></pos-type-router>);
    await page.instance.receiveResource({
      types: () => [{ uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' }],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
`);
  });

  it('renders HTML tool if available', async () => {
    const page = await newSpecPage({
      components: [PosTypeRouter],
      html: `<pos-type-router />`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [{ uri: 'https://schema.org/Recipe', label: 'Recipe' }],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
    <pos-type-router>
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-html-tool class="tool visible" fragment="<pos-label/>"></pos-html-tool>
        </div>
      </section>
    </pos-type-router>
`);
  });

  it('renders the selected tool and updates query param', async () => {
    window.location.href = 'https://pod-os.test/container/file';
    const historySpy = vi.spyOn(window.history, 'replaceState');
    const page = await render(<pos-type-router></pos-type-router>);

    await page.instance.receiveResource({
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

    expect(page.root!.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools transition">
          <pos-app-document-viewer class="tool hidden"></pos-app-document-viewer>
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
`);
  });

  it('renders selected tool, if given as URI param', async () => {
    window.location.href = 'https://pod.test/container/file?tool=pos-app-generic';
    const page = await render(<pos-type-router></pos-type-router>);
    await page.instance.receiveResource({
      types: () => [
        { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
        { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
      ],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
`);
  });

  it('switches from old to new tool', async () => {
    window.location.href = 'https://pod-os.test/container/file';
    // given the document viewer is rendered for a resource
    const page = await render(<pos-type-router></pos-type-router>);

    await page.instance.receiveResource({
      types: () => [
        { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
        { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
      ],
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools">
          <pos-app-document-viewer class="tool visible"></pos-app-document-viewer>
        </div>
      </section>
`);

    // when the user switches to the generic tool
    page.root.dispatchEvent(
      new CustomEvent('pod-os:tool-selected', {
        detail: { element: 'pos-app-generic' },
      }),
    );
    await page.waitForChanges();

    // Then the generic tool is showing up, while the document viewer gets hidden
    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <pos-tool-select></pos-tool-select>
        <div class="tools transition">
          <pos-app-document-viewer class="tool hidden"></pos-app-document-viewer>
          <pos-app-generic class="tool visible"></pos-app-generic>
        </div>
      </section>
`);

    // when the animation ends
    const documentViewer = page.root.shadowRoot!.querySelector('.transition')!;
    documentViewer.dispatchEvent(new CustomEvent('animationend'));
    await page.waitForChanges();

    // then the document viewer is removed from DOM
    expect(page.root.shadowRoot).toEqualHtml(`
    <section>
      <pos-tool-select></pos-tool-select>
      <div class="tools">
        <pos-app-generic class="tool visible"></pos-app-generic>
      </div>
    </section>
`);
  });
});
