import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from '@testing-library/user-event';

import { localSettings } from '../../../store/settings';
import { withinShadow } from '../../../test/withinShadow';

import './pos-setting-offline-cache';

describe('pos-setting-offline-cache', () => {
  beforeEach(() => {
    localSettings.dispose();
  });
  it('renders cache setting', async () => {
    const page = await render(<pos-setting-offline-cache></pos-setting-offline-cache>);
    const checkbox = withinShadow(page).getByLabelText('Enable offline cache');
    expect(checkbox).toEqualHtml(`<input type="checkbox">`);
  });

  it('checkbox is checked, if offline cache is enabled', async () => {
    localSettings.state.offlineCache = true;
    const page = await render(<pos-setting-offline-cache></pos-setting-offline-cache>);
    const checkbox = withinShadow(page).getByLabelText('Enable offline cache');
    expect(checkbox).toBeChecked();
  });

  it('checkbox is not checked, if offline cache is disabled', async () => {
    localSettings.state.offlineCache = false;
    const page = await render(<pos-setting-offline-cache></pos-setting-offline-cache>);
    const checkbox = withinShadow(page).getByLabelText('Enable offline cache');
    expect(checkbox).not.toBeChecked();
  });

  it('enables offlineCache setting when checkbox is checked', async () => {
    const page = await render(<pos-setting-offline-cache></pos-setting-offline-cache>);

    expect(localSettings.state.offlineCache).toBe(false);
    const checkbox = withinShadow(page).getByLabelText('Enable offline cache');
    await userEvent.click(checkbox);
    expect(localSettings.state.offlineCache).toBe(true);
  });

  it('disables offlineCache setting when checkbox is unchecked', async () => {
    const page = await render(<pos-setting-offline-cache></pos-setting-offline-cache>);
    localSettings.state.offlineCache = true;
    expect(localSettings.state.offlineCache).toBe(true);
    const checkbox = withinShadow(page).getByLabelText('Enable offline cache');
    await userEvent.click(checkbox);
    expect(localSettings.state.offlineCache).toBe(false);
  });
});
