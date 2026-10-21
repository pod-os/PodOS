import { describe, expect, it, vi } from 'vitest';

import { PodOS, SearchIndex } from '@pod-os/core';

import { mention } from './index';

describe('mention extension', () => {
  it('is constructed with the given PodOS instance', () => {
    const mockOs = {
      buildSearchIndex: vi.fn().mockResolvedValue({ search: vi.fn().mockReturnValue([]) }),
      store: { get: vi.fn() },
    } as unknown as PodOS;

    expect(mention(mockOs)).toBeDefined();
  });

  it('builds the search index once at configuration time, not per suggestion lookup', async () => {
    const mockSearchIndex = {
      search: vi.fn().mockReturnValue([{ ref: 'https://pod.test/alice/profile/card#me' }]),
    } as unknown as SearchIndex;
    const mockOs = {
      buildSearchIndex: vi.fn().mockResolvedValue(mockSearchIndex),
      store: {
        get: vi.fn().mockReturnValue({ label: () => 'Alice' }),
      },
    } as unknown as PodOS;

    const extension = mention(mockOs);
    expect(mockOs.buildSearchIndex).toHaveBeenCalled();

    const items = extension.options.suggestion.items;
    await items({ query: 'ali', editor: null as any, signal: null as any });
    await items({ query: 'al', editor: null as any, signal: null as any });

    expect(mockOs.buildSearchIndex).toHaveBeenCalledTimes(1);
  });
});
