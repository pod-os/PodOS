import { describe, expect, it, Mock, vi } from 'vitest';

import { PodOS, SearchIndex } from '@pod-os/core';

import { mention } from './index';
import { mockPodOS } from '../../../../test/mockPodOS.vitest';

describe('mention extension', () => {
  it('is constructed with the given PodOS instance', () => {
    const mockOs = {
      buildSearchIndex: vi.fn().mockResolvedValue({ search: vi.fn().mockReturnValue([]) }),
      store: { get: vi.fn() },
    } as unknown as PodOS;

    expect(mention(mockOs, 'https://pod.test/alice/document.md')).toBeDefined();
  });

  describe('suggestion.shouldShow', () => {
    const getShouldShow = (mockOs: PodOS) =>
      mention(mockOs, 'https://pod.test/alice/document.md').options.suggestion.shouldShow!;

    const mockOs = {
      buildSearchIndex: vi.fn(),
    } as unknown as PodOS;

    it('hides the suggestion menu while no character has been typed after #', () => {
      const shouldShow = getShouldShow(mockOs);
      expect(shouldShow({ query: '', text: '#' } as any)).toBe(false);
    });

    it('shows the suggestion menu once at least one character has been typed', () => {
      const shouldShow = getShouldShow(mockOs);
      expect(shouldShow({ query: 'a', text: '#a' } as any)).toBe(true);
    });
  });

  it('builds the search index once at configuration time, not per suggestion lookup', async () => {
    const mockSearchIndex = {
      search: vi.fn().mockReturnValue([{ ref: 'https://pod.test/alice/profile/card#me' }]),
    } as unknown as SearchIndex;
    const mockOs = mockPodOS();
    (mockOs.store.get as Mock).mockReturnValue({ label: () => 'Alice' });
    (mockOs.buildSearchIndex as Mock).mockResolvedValue(mockSearchIndex)

    const extension = mention(mockOs, "https://pod.test/alice/document.md");
    expect(mockOs.buildSearchIndex).toHaveBeenCalled();

    const items = extension.options.suggestion.items!;
    await items({ query: 'ali', editor: null as any, signal: null as any });
    await items({ query: 'al', editor: null as any, signal: null as any });

    expect(mockOs.buildSearchIndex).toHaveBeenCalledTimes(1);
  });
});
