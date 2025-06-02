import { Component, h, Host } from '@stencil/core';
import { localSettings } from '../../../store/settings';

@Component({
  tag: 'pos-setting-offline-cache',
  styleUrl: 'pos-setting-offline-cache.css',
  shadow: true,
})
export class PosSettingOfflineCache {
  render() {
    return (
      <Host>
        <div>
          <h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
            Cache Settings
          </h2>
          <p class="info">ℹ Enable offline cache to be able to access previously loaded data while offline.</p>
          <p class="warn">⚠ Private data may be stored on this device. Only enable it, if you trust this device.</p>
          <label>
            <input
              type="checkbox"
              checked={localSettings.state.offlineCache}
              onChange={ev => (localSettings.state.offlineCache = (ev.target as HTMLInputElement).checked)}
            ></input>
            Enable offline cache
          </label>
        </div>
      </Host>
    );
  }
}
