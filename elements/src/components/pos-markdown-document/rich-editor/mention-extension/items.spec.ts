import { describe, expect, it, vi } from 'vitest';

import { PodOS, SearchIndex } from '@pod-os/core';

import { items } from './items';
import { when } from 'vitest-when';

describe('mention items', () => {
  it('returns mention suggestions from the search index and the store', () => {
    const mockSearchIndex = {
      search: vi.fn().mockReturnValue([{ ref: 'https://pod.test/alice/profile/card#me' }]),
    } as unknown as SearchIndex;
    const mockOs = {
      store: {
        get: vi.fn().mockReturnValue({ label: () => 'Alice' }),
      },
      proposeUriForNewThing: vi.fn(),
    } as unknown as PodOS;

    let result = items(mockOs, mockSearchIndex, 'ali', 'https://pod.test/alice/document.md');
    expect(result[0]).toEqual({ id: 'https://pod.test/alice/profile/card#me', label: 'Alice', type: 'indexed' });
    expect(mockSearchIndex.search).toHaveBeenCalledWith('ali');
    expect(mockOs.store.get).toHaveBeenCalledWith('https://pod.test/alice/profile/card#me');
  });
  it('returns an option to create a new thing based on the query', () => {
    const mockSearchIndex = {
      search: vi.fn().mockReturnValue([]),
    } as unknown as SearchIndex;
    let proposeUriForNewThing = vi.fn();
    const mockOs = {
      store: {
        get: vi.fn().mockReturnValue({ label: () => 'Alice' }),
      },
      proposeUriForNewThing,
    } as unknown as PodOS;
    when(proposeUriForNewThing)
      .calledWith('https://pod.test/alice/document.md', 'something')
      .thenReturn('https://pod.test/alice/something#it');

    let result = items(mockOs, mockSearchIndex, 'something', 'https://pod.test/alice/document.md');
    expect(result[0]).toEqual({ id: 'https://pod.test/alice/something#it', label: 'something', type: 'new-thing' });
  });
});
