import { newSpecPage } from '@stencil/core/testing';
import { PosCreateNewContainerItem } from './pos-create-new-container-item';

describe('pos-create-new-container-item', () => {
  it('renders input for new file', async () => {
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="file"/>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-create-new-container-item type="file">
        <form>
          <sl-icon name="file-earmark-plus"></sl-icon>
          <input placeholder="Enter file name" type="text">
        </form>
      </pos-create-new-container-item>
    `);
  });

  it('renders input for new folder', async () => {
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="folder"/>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-create-new-container-item type="folder">
        <form>
          <sl-icon name="folder-plus"></sl-icon>
          <input placeholder="Enter folder name" type="text">
        </form>
      </pos-create-new-container-item>
    `);
  });
});
