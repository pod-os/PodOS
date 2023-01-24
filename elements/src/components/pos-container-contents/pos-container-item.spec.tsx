jest.mock('@pod-os/core', () => ({}));

import { newSpecPage } from '@stencil/core/testing';

import { PosContainerItem } from './pos-container-item';

describe('pos-container-item', () => {
  it('only shows the body initially', async () => {
    const page = await newSpecPage({
      components: [PosContainerItem],
      html: `<pos-container-item>item body</pos-container-item>`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <pos-container-item>
        item body
      </pos-container-item>
  `);
  });

  it('renders item with document icon for ldp resources', async () => {
    const page = await newSpecPage({
      components: [PosContainerItem],
      html: `<pos-container-item>file name</pos-container-item>`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          uri: 'http://www.w3.org/ns/ldp#Resource',
        },
      ],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <pos-container-item>
        <ion-item>
          <ion-icon name="document-outline" slot="start"></ion-icon>
          file name
        </ion-item>
      </pos-container-item>
    `);
  });

  it('renders item with folder icon for ldp containers', async () => {
    const page = await newSpecPage({
      components: [PosContainerItem],
      html: `<pos-container-item>folder name</pos-container-item>`,
      supportsShadowDom: false,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          uri: 'http://www.w3.org/ns/ldp#Container',
        },
      ],
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
        <pos-container-item>
            <ion-item>
                <ion-icon name="folder-outline" slot="start"></ion-icon>
                folder name
            </ion-item>
        </pos-container-item>
    `);
  });
});
