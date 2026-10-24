import { vi, describe, it, expect } from 'vitest';
import { processSelectedMention } from './processSelectedMention';
import { mockPodOS } from '../../../../test/mockPodOS.vitest';
import { MentionItem } from './pos-mention-menu/pos-mention-menu';

describe('process selected mention', () => {
  it('calls the original command for items from index', () => {
    const os = mockPodOS();
    const command = vi.fn();
    const process = processSelectedMention(os, command);
    const item: MentionItem = {
      id: 'some-id',
      label: 'some-label',
      type: 'indexed',
    };
    process(item);
    expect(command).toHaveBeenCalledWith(item);
  });
});
