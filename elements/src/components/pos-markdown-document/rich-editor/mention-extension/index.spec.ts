import { describe, expect, it, vi } from 'vitest';

import { PodOS } from '@pod-os/core';

import { mention } from './index';

describe('mention extension', () => {
  it('is constructed with the given PodOS instance', () => {
    const mockOs = {
      buildSearchIndex: vi.fn().mockResolvedValue({ search: vi.fn().mockReturnValue([]) }),
      store: { get: vi.fn() },
    } as unknown as PodOS;

    expect(mention(mockOs)).toBeDefined();
  });
});
