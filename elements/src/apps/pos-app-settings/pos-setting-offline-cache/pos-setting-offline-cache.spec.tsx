import { newSpecPage } from '@stencil/core/testing';
import { PosSettingOfflineCache } from './pos-setting-offline-cache';

import { fireEvent } from '@testing-library/dom';
import { localSettings } from '../../../store/settings';

describe('pos-setting-offline-cache', () => {
  beforeEach(() => {
    localSettings.dispose();
  });
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

  it('checkbox is checked, if offline cache is enabled', async () => {
    localSettings.state.offlineCache = true;

    const page = await newSpecPage({
      components: [PosSettingOfflineCache],
      html: `<pos-setting-offline-cache />`,
      supportsShadowDom: false,
    });

    const label = page.root.querySelector('label');
    expect(label).toEqualHtml(
      `<label>
        <input type="checkbox" checked />
        Enable offline cache
      </label>`,
    );
  });

  it('enables offlineCache setting when checkbox is checked', async () => {
    const page = await newSpecPage({
      components: [PosSettingOfflineCache],
      html: `<pos-setting-offline-cache />`,
      supportsShadowDom: false,
    });

    expect(localSettings.state.offlineCache).toBe(false);
    const checkbox = page.root.querySelector('input');
    fireEvent.change(checkbox, { target: { checked: true } });
    expect(localSettings.state.offlineCache).toBe(true);
  });

  it('disables offlineCache setting when checkbox is unchecked', async () => {
    const page = await newSpecPage({
      components: [PosSettingOfflineCache],
      html: `<pos-setting-offline-cache />`,
      supportsShadowDom: false,
    });

    localSettings.state.offlineCache = true;
    expect(localSettings.state.offlineCache).toBe(true);
    const checkbox = page.root.querySelector('input');
    fireEvent.change(checkbox, { target: { checked: false } });
    expect(localSettings.state.offlineCache).toBe(false);
  });
});
