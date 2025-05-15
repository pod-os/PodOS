import { PodOS } from '@pod-os/core';
import { IndexedDbOfflineCache } from './cache/IndexedDbOfflineCache';
import { NavigatorOnlineStatus } from './cache/NavigatorOnlineStatus';

export const createPodOS = (): PodOS => {
  return new PodOS({
    offlineCache: new IndexedDbOfflineCache(),
    onlineStatus: new NavigatorOnlineStatus(),
  });
};
