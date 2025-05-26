const addEventListener = jest.spyOn(window, 'addEventListener');

import { localSettings } from './settings';

describe('Settings Store', () => {
  beforeEach(() => {
    localStorage.clear();
    localSettings.reset();
  });

  it('should initialize with default values when no stored settings exist', () => {
    expect(localSettings.state.offlineCache).toBe(false);
  });

  it('should initialize with stored values from localStorage', () => {
    localStorage.setItem('settings', JSON.stringify({ offlineCache: true }));
    jest.resetModules();
    const { localSettings: newStore } = require('./settings');
    expect(newStore.state.offlineCache).toBe(true);
  });

  it('should persist changes to localStorage', () => {
    localSettings.state.offlineCache = true;
    const stored = JSON.parse(localStorage.getItem('settings'));
    expect(stored.offlineCache).toBe(true);
  });

  it('should sync changes from other tabs', () => {
    // given offline cache is disabled
    localSettings.state.offlineCache = false;

    // when window gets a storage event, that notifies about new settings
    const storageEvent = new CustomEvent('storage', {
      // @ts-ignore
      key: 'settings',
      newValue: JSON.stringify({ offlineCache: true }),
    });
    expect(addEventListener).toHaveBeenCalledTimes(1);
    const handler = addEventListener.mock.calls[0][1] as Function;
    handler(storageEvent);

    // then the settings are updated
    expect(localSettings.state.offlineCache).toBe(true);
  });

  it('should not sync changes for other storage keys', () => {
    // given offline cache is disabled
    localSettings.state.offlineCache = false;

    // when window gets a storage event, but not for settings

    const storageEvent = new CustomEvent('storage', {
      // @ts-ignore
      key: 'other-key',
      newValue: JSON.stringify({ offlineCache: true }),
    });
    expect(addEventListener).toHaveBeenCalledTimes(1);
    const handler = addEventListener.mock.calls[0][1] as Function;
    handler(storageEvent);

    // then the local settings stay unchanged
    expect(localSettings.state.offlineCache).toBe(false);
  });
});
