import { newSpecPage } from '@stencil/core/testing';
import { PosCreateNewContainerItem } from './pos-create-new-container-item';

describe('pos-create-new-container-item', () => {
  it('renders input for new file', async () => {
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="file"/>`,
    });

    expect(page.root).toEqualHtml(`
      <pos-create-new-container-item type="file">
        <input placeholder="Enter file name" type="text">
      </pos-create-new-container-item>
    `);
  });

  it('renders input for new folder', async () => {
    const page = await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="folder"/>`,
    });

    expect(page.root).toEqualHtml(`
      <pos-create-new-container-item type="folder">
        <input placeholder="Enter folder name" type="text">
      </pos-create-new-container-item>
    `);
  });
});
