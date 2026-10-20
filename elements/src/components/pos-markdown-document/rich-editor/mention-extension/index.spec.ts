import { describe, expect, it, vi } from 'vitest';

import { PodOS, SearchIndex } from '@pod-os/core';

import { mention } from './index';

describe('mention extension', () => {
  it('provides no mention suggestions without a PodOS instance', async () => {
    // @ts-ignore the suggestion config is tiptap's internal shape, not a public API
    await expect(mention().options.suggestion.items({ query: 'ali' })).resolves.toEqual([]);
  });

  it('provides mention suggestions from the search index and the store', async () => {
    const mockSearchIndex = {
      search: vi.fn().mockReturnValue([{ ref: 'https://pod.test/alice/profile/card#me' }]),
    } as unknown as SearchIndex;
    const mockOs = {
      buildSearchIndex: vi.fn().mockResolvedValue(mockSearchIndex),
      store: {
        get: vi.fn().mockReturnValue({ label: () => 'Alice' }),
      },
    } as unknown as PodOS;

    const items = mention(mockOs).options.suggestion.items;

    await expect(
      // @ts-ignore the suggestion config is tiptap's internal shape, not a public API
      items({ query: 'ali' }),
    ).resolves.toEqual([{ id: 'https://pod.test/alice/profile/card#me', label: 'Alice' }]);
    expect(mockOs.buildSearchIndex).toHaveBeenCalled();
    expect(mockSearchIndex.search).toHaveBeenCalledWith('ali');
    expect(mockOs.store.get).toHaveBeenCalledWith('https://pod.test/alice/profile/card#me');
  });
});
