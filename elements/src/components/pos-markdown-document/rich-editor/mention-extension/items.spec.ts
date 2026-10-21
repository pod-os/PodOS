import { describe, expect, it, vi } from 'vitest';

import { PodOS, SearchIndex } from '@pod-os/core';

import { items } from './items';

describe('mention items', () => {
  it('returns mention suggestions from the search index and the store', () => {
    const mockSearchIndex = {
      search: vi.fn().mockReturnValue([{ ref: 'https://pod.test/alice/profile/card#me' }]),
    } as unknown as SearchIndex;
    const mockOs = {
      store: {
        get: vi.fn().mockReturnValue({ label: () => 'Alice' }),
      },
    } as unknown as PodOS;

    expect(items(mockOs, mockSearchIndex, 'ali')).toEqual([
      { id: 'https://pod.test/alice/profile/card#me', label: 'Alice' },
    ]);
    expect(mockSearchIndex.search).toHaveBeenCalledWith('ali');
    expect(mockOs.store.get).toHaveBeenCalledWith('https://pod.test/alice/profile/card#me');
  });
});
