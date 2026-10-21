import { PodOS } from '@pod-os/core';

export async function items(os: PodOS, query: string) {
  const searchIndex = await os.buildSearchIndex();
  return searchIndex.search(query).map(({ ref }) => {
    const thing = os.store.get(ref);
    return { id: ref, label: thing.label() };
  });
}
