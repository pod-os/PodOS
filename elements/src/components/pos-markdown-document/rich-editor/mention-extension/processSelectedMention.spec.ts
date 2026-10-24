import { vi, describe, it, expect, Mock, beforeEach } from 'vitest';
import { processSelectedMention } from './processSelectedMention';
import { mockPodOS } from '../../../../test/mockPodOS.vitest';
import { MentionItem } from './pos-mention-menu/pos-mention-menu';
import { PodOS } from '@pod-os/core';

describe('process selected mention', () => {
  let process: (item: MentionItem) => void;
  let command: Mock;
  let os: PodOS;
  beforeEach(() => {
    os = mockPodOS();
    command = vi.fn();
    process = processSelectedMention(os, command);
  });

  describe('for indexed items', () => {
    let item: MentionItem;
    beforeEach(() => {
      item = {
        id: 'some-id',
        label: 'some-label',
        type: 'indexed',
      };
      process(item);
    });

    it('calls the original command', () => {
      expect(command).toHaveBeenCalledWith(item);
    });
  });

  describe('for newly created items', () => {
    let item: MentionItem;
    beforeEach(() => {
      item = {
        id: 'some-id',
        label: 'some-label',
        type: 'new-thing',
      };
      process(item);
    });
    it('calls the original command', () => {
      expect(command).toHaveBeenCalledWith(item);
    });
  });
});
