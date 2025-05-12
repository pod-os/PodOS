import { PodOS } from '@pod-os/core';
import { IndexedDbOfflineCache } from './cache/IndexedDbOfflineCache';

export const createPodOS = (): PodOS => {
  return new PodOS({
    offlineCache: new IndexedDbOfflineCache(),
  });
};
