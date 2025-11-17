import { newSpecPage } from '@stencil/core/testing';
import { PosPicture } from './pos-picture';

describe('pos-picture', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-picture>
        <mock:shadow-root>
          <div class="no-picture">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pos-picture>
  `);
  });

  it('renders pos-image depicting resource', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture />`,
    });
    await page.rootInstance.receiveResource({
      label: () => 'a picture',
      picture: () => ({
        url: 'https://resource.test/picture.png',
      }),
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-picture>
        <mock:shadow-root><pos-image src="https://resource.test/picture.png" alt="a picture"/></mock:shadow-root>
      </pos-picture>
  `);
  });

  it('renders pos-image with blurred background', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture blurred-background />`,
    });
    await page.rootInstance.receiveResource({
      label: () => 'a picture',
      picture: () => ({
        url: 'https://resource.test/picture.png',
      }),
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-picture blurred-background>
        <mock:shadow-root><pos-image blurredbackground="" src="https://resource.test/picture.png" alt="a picture"/></mock:shadow-root>
      </pos-picture>
  `);
  });

  it('renders nothing when resource has no picture', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture />`,
    });
    await page.rootInstance.receiveResource({
      picture: () => null,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-picture>
        <mock:shadow-root>
          <div class="no-picture">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pos-picture>
  `);
  });

  it('renders slot as fallback when resource has no picture', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      supportsShadowDom: false,
      html: `<pos-picture>No picture, but this nice text</pos-picture>`,
    });
    await page.rootInstance.receiveResource({
      picture: () => null,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-picture>
        <div class="no-picture">
          No picture, but this nice text
        </div>
      </pos-picture>
  `);
  });

  describe('upload mode', () => {
    let page;

    beforeEach(async () => {
      page = await newSpecPage({
        components: [PosPicture],
        html: `<pos-picture />`,
      });
      await page.rootInstance.receiveResource({
        label: () => 'a picture',
        picture: () => ({ url: 'https://resource.test/picture.png' }),
        editable: true,
      });
      await page.waitForChanges();
    });

    it('renders upload button when editable', () => {
      const uploadButton = page.root?.shadowRoot?.querySelector('button');
      expect(uploadButton).not.toBeNull();
      expect(uploadButton?.textContent).toEqual('Upload picture');
    });

    it('shows file upload on button click', async () => {
      const uploadButton = page.root?.shadowRoot?.querySelector('button');
      uploadButton?.click();
      await page.waitForChanges();

      const posUpload = page.root?.shadowRoot?.querySelector('pos-upload');
      expect(posUpload).not.toBeNull();
    });

    it('exits upload mode when files are selected', async () => {
      const uploadButton = page.root?.shadowRoot?.querySelector('button');
      uploadButton?.click();
      await page.waitForChanges();

      const posUpload = page.root?.shadowRoot?.querySelector('pos-upload');
      posUpload?.dispatchEvent(
        new CustomEvent('pod-os:files-selected', {
          bubbles: true,
          detail: [],
        }),
      );
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('pos-upload')).toBeNull();
    });
  });

  describe('upload button without picture', () => {
    it('renders upload button when resource has no picture', async () => {
      // Given an editable resource without a picture
      const page = await newSpecPage({
        components: [PosPicture],
        html: `<pos-picture />`,
      });
      await page.rootInstance.receiveResource({
        label: () => 'resource without picture',
        picture: () => null,
        editable: true,
      });
      await page.waitForChanges();

      // When the component renders
      const uploadButton = page.root?.shadowRoot?.querySelector('button');

      // Then the upload button should be visible
      expect(uploadButton).not.toBeNull();
    });
  });

  describe('no-upload property', () => {
    it('disables upload button when no-upload is set', async () => {
      // Given an editable resource with no-upload attribute
      const page = await newSpecPage({
        components: [PosPicture],
        html: `<pos-picture no-upload />`,
      });
      await page.rootInstance.receiveResource({
        label: () => 'a picture',
        picture: () => ({ url: 'https://resource.test/picture.png' }),
        editable: true,
      });
      await page.waitForChanges();

      // When the component renders
      const uploadButton = page.root?.shadowRoot?.querySelector('button');

      // Then the upload button should not be visible
      expect(uploadButton).toBeNull();
    });
  });
});
