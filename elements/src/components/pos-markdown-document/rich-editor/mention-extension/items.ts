import { PodOS, SearchIndex } from '@pod-os/core';

export function items(os: PodOS, searchIndex: SearchIndex, query: string) {
  return searchIndex.search(query).map(({ ref }) => {
    const thing = os.store.get(ref);
    return { id: ref, label: thing.label() };
  });
}
