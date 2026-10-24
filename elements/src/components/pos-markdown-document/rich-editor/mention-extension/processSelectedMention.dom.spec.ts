import { vi, describe, it, expect, Mock, beforeEach } from 'vitest';
import { processSelectedMention } from './processSelectedMention';
import { mockPodOS } from '../../../../test/mockPodOS.vitest';
import { MentionItem } from './pos-mention-menu/pos-mention-menu';
import { PodOS } from '@pod-os/core';
import { waitFor } from '@testing-library/dom';

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
        id: 'https://thing.example#it',
        label: 'some-label',
        type: 'indexed',
      };
      process(item);
    });

    it('calls the original command', () => {
      expect(command).toHaveBeenCalledWith(item);
    });

    it('does not create a new thing', () => {
      expect(os.addNewThing).not.toHaveBeenCalled();
    });
  });

  describe('for newly created items', () => {
    let item: MentionItem;
    beforeEach(() => {
      item = {
        id: 'https://thing.example#it',
        label: 'some-label',
        type: 'new-thing',
      };
      process(item);
    });
    it('calls the original command', () => {
      expect(command).toHaveBeenCalledWith(item);
    });

    it('adds a new thing', () => {
      expect(os.addNewThing).toHaveBeenCalledWith('https://thing.example#it', 'some-label');
    });
  });

  describe('when adding a new thing fails', () => {
    let item: MentionItem;
    let onError: Mock;
    beforeEach(() => {
      item = {
        id: 'https://thing.example#it',
        label: 'some-label',
        type: 'new-thing',
      };
      onError = vi.fn();
      document.addEventListener('pod-os:error', onError);
      (os.addNewThing as Mock).mockRejectedValue(new Error('thing could not be added'));
      process(item);
    });

    it('calls the original command', () => {
      expect(command).toHaveBeenCalledWith(item);
    });

    it('emits a pod-os:error event', async () => {
      await waitFor(() => expect(onError).toHaveBeenCalled());
      expect(onError.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          detail: new Error('thing could not be added'),
        }),
      );
    });
  });
});
