import { newSpecPage } from '@stencil/core/testing';
import { PosSettingOfflineCache } from './pos-setting-offline-cache';

describe('pos-setting-offline-cache', () => {
  it('renders cache setting', async () => {
    const page = await newSpecPage({
      components: [PosSettingOfflineCache],
      html: `<pos-setting-offline-cache />`,
      supportsShadowDom: false,
    });

    const label = page.root.querySelector('label');
    expect(label).toEqualHtml(
      `<label>
        <input type="checkbox" />
        Enable offline cache
      </label>`,
    );
  });
});
