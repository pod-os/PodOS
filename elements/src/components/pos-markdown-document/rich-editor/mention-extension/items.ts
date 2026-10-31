import { PodOS, SearchIndex } from '@pod-os/core';

export function items(os: PodOS, searchIndex: SearchIndex, query: string, baseUrl: string) {
  const searchResult = searchIndex.search(query).map(({ ref }) => {
    const thing = os.store.get(ref);
    return { id: ref, label: thing.label(), type: 'indexed' };
  });
  const newThingUri = os.proposeUriForNewThing(baseUrl, query);
  return [
    ...searchResult,
    {
      id: newThingUri,
      label: query,
      type: 'new-thing',
    },
  ];
}
