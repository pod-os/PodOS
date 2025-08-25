import { NoOfflineCache, PodOS } from '@pod-os/core';
import { IndexedDbOfflineCache } from './cache/IndexedDbOfflineCache';
import { NavigatorOnlineStatus } from './cache/NavigatorOnlineStatus';
import { LocalSettings } from './store/settings';
import { BrowserSession } from './authentication';

export const createPodOS = (session: BrowserSession, settings: LocalSettings): PodOS => {
  return new PodOS({
    session,
    offlineCache: settings.offlineCache ? new IndexedDbOfflineCache() : new NoOfflineCache(),
    onlineStatus: new NavigatorOnlineStatus(),
  });
};
