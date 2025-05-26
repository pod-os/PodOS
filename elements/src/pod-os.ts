import { NoOfflineCache, PodOS } from '@pod-os/core';
import { IndexedDbOfflineCache } from './cache/IndexedDbOfflineCache';
import { NavigatorOnlineStatus } from './cache/NavigatorOnlineStatus';
import { LocalSettings } from './store/settings';

export const createPodOS = (settings: LocalSettings): PodOS => {
  return new PodOS({
    offlineCache: settings.offlineCache ? new IndexedDbOfflineCache() : new NoOfflineCache(),
    onlineStatus: new NavigatorOnlineStatus(),
  });
};
