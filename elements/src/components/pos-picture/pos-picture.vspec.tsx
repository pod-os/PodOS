import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { Components } from '../../components';

import { usePodOS } from '../events/usePodOS';
import './pos-picture';

vi.mock('../events/usePodOS');

describe('pos-picture', () => {
  it('is empty initially', async () => {
    const page = await render(<pos-picture></pos-picture>);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-picture class="hydrated">
        <mock:shadow-root>
          <div class="no-picture">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pos-picture>
    `);
  });

  it('renders pos-image depicting resource', async () => {
    const page = await render(<pos-picture></pos-picture>);

    await page.instance.receiveResource({
      label: () => 'a picture',
      picture: () => ({
        url: 'https://resource.test/picture.png',
      }),
    });
    await page.waitForChanges();
    expect(page.root).toMatchInlineSnapshot(`
      <pos-picture class="hydrated">
        <mock:shadow-root>
          <pos-image src="https://resource.test/picture.png" alt="a picture"></pos-image>
        </mock:shadow-root>
      </pos-picture>
    `);
  });

  it('renders pos-image with blurred background', async () => {
    const page = await render(<pos-picture blurredBackground></pos-picture>);

    await page.instance.receiveResource({
      label: () => 'a picture',
      picture: () => ({
        url: 'https://resource.test/picture.png',
      }),
    });
    await page.waitForChanges();
    expect(page.root).toMatchInlineSnapshot(`
      <pos-picture class="hydrated">
        <mock:shadow-root>
          <pos-image blurredbackground src="https://resource.test/picture.png" alt="a picture"></pos-image>
        </mock:shadow-root>
      </pos-picture>
    `);
  });

  it('renders nothing when resource has no picture', async () => {
    const page = await render(<pos-picture></pos-picture>);

    await page.instance.receiveResource({
      picture: () => null,
    });
    await page.waitForChanges();
    expect(page.root).toMatchInlineSnapshot(`
      <pos-picture class="hydrated">
        <mock:shadow-root>
          <div class="no-picture">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pos-picture>
    `);
  });

  it('renders slot as fallback when resource has no picture', async () => {
    const page = await render(<pos-picture>No picture, but this nice text</pos-picture>);
    await page.instance.receiveResource({
      picture: () => null,
    });
    await page.waitForChanges();
    expect(page.root).toMatchInlineSnapshot(`
      <pos-picture class="hydrated">
        <mock:shadow-root>
          <div class="no-picture">
            <slot></slot>
          </div>
        </mock:shadow-root>
        No picture, but this nice text
      </pos-picture>
    `);
  });

  describe('upload mode', () => {
    let page: RenderResult;

    beforeEach(async () => {
      page = await render(<pos-picture></pos-picture>);
      await page.instance.receiveResource({
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

    it('exits upload mode when close button is clicked', async () => {
      const uploadButton = page.root?.shadowRoot?.querySelector('button');
      uploadButton?.click();
      await page.waitForChanges();

      const closeButton = page.root?.shadowRoot?.querySelector('button')!;
      closeButton.click();
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('pos-upload')).toBeNull();
    });
  });

  describe('upload button without picture', () => {
    it('renders upload button when resource has no picture', async () => {
      // Given an editable resource without a picture
      const page = await render(<pos-picture></pos-picture>);
      await page.instance.receiveResource({
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
      const page = await render(<pos-picture no-upload></pos-picture>);
      await page.instance.receiveResource({
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

  describe('uploading picture', () => {
    it('adds uploaded picture to the thing', async () => {
      // Given a PodOS instance with uploadAndAddPicture
      const mockUploadAndAddPicture = vi.fn();
      (usePodOS as Mock).mockResolvedValue({
        uploadAndAddPicture: mockUploadAndAddPicture,
      } as any);

      // And an editable resource without a picture
      const page = await render(<pos-picture></pos-picture>);

      const mockResource = {
        label: () => 'a resource',
        picture: () => null,
        editable: true,
      };

      await page.instance.receiveResource(mockResource);
      await page.waitForChanges();

      // And the user enters upload mode
      const uploadButton = page.root?.shadowRoot?.querySelector('button');
      uploadButton?.click();
      await page.waitForChanges();

      // When a picture file is uploaded
      const mockFile = new File(['image content'], 'picture.jpg', {
        type: 'image/jpeg',
      });
      const posUpload: Components.PosUpload = page.root?.shadowRoot?.querySelector('pos-upload')!;
      posUpload.uploader(mockFile);

      // Then the picture should be uploaded and added to the thing
      expect(mockUploadAndAddPicture).toHaveBeenCalledWith(mockResource, mockFile);
    });
  });
});
