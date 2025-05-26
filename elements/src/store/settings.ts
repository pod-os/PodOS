import { createStore } from '@stencil/store';

export interface LocalSettings {
  offlineCache: boolean;
}

const storedSettings = localStorage.getItem('settings');
const initialSettings = storedSettings
  ? JSON.parse(storedSettings)
  : {
      offlineCache: false,
    };

export const localSettings = createStore<LocalSettings>(initialSettings);

persistChanges();
syncChangesAcrossTabs();

function persistChanges() {
  localSettings.on('set', () => {
    const snapshot = JSON.stringify(localSettings.state);
    localStorage.setItem('settings', snapshot);
  });
}
function syncChangesAcrossTabs() {
  window.addEventListener('storage', event => {
    if (event.key === 'settings' && event.newValue) {
      const newSettings: LocalSettings = JSON.parse(event.newValue);
      localSettings.state.offlineCache = newSettings.offlineCache;
    }
  });
}
