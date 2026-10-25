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

    expect(mention(mockOs, 'https://pod.test/alice/document.md', null as unknown as HTMLElement)).toBeDefined();
  });

  /**
   * This is important, because without this option tiptap will register clicking on an actual suggestion
   * as an "outside" click and dismiss the popup instead of inserting the suggestion
   */
  it('does not dismiss the suggestion menu on clicks outside the editor or menu', () => {
    const extension = mention(mockPodOS(), 'https://pod.test/alice/document.md', null as unknown as HTMLElement);
    expect(extension.options.suggestion.dismissOnOutsideClick).toBe(false);
  });

  describe('suggestion.shouldShow', () => {
    const getShouldShow = (mockOs: PodOS) =>
      mention(mockOs, 'https://pod.test/alice/document.md', null as unknown as HTMLElement).options.suggestion
        .shouldShow!;

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
    (mockOs.buildSearchIndex as Mock).mockResolvedValue(mockSearchIndex);

    const extension = mention(mockOs, 'https://pod.test/alice/document.md', null as unknown as HTMLElement);
    expect(mockOs.buildSearchIndex).toHaveBeenCalled();

    const items = extension.options.suggestion.items!;
    await items({ query: 'ali', editor: null as any, signal: null as any });
    await items({ query: 'al', editor: null as any, signal: null as any });

    expect(mockOs.buildSearchIndex).toHaveBeenCalledTimes(1);
  });
});
