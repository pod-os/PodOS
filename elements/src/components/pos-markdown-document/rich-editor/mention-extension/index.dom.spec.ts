import { afterEach, describe, expect, it, vi } from 'vitest';

import { PodOS } from '@pod-os/core';

import { RichEditor } from '../RichEditor';

describe('mention extension', () => {
  describe('suggestion lookups', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('waits for a 120 ms pause before looking up suggestions', async () => {
      vi.useFakeTimers();
      const search = vi.fn().mockReturnValue([{ ref: 'https://pod.test/alice/profile/card#me' }]);
      const mockOs = {
        buildSearchIndex: vi.fn().mockResolvedValue({ search }),
        store: { get: vi.fn().mockReturnValue({ label: () => 'Alice' }) },
      } as unknown as PodOS;

      const div = document.createElement('div');
      const editor = new RichEditor(div, '', 'https://pod.test', mockOs);
      editor.startEditing();

      // @ts-ignore Accessing a private field here for testing
      const tiptap = editor.editor;
      tiptap.commands.insertContent('#ali');

      // fast typing: the next keystroke arrives before the pause completes
      tiptap.commands.insertContent('v');

      await vi.advanceTimersByTimeAsync(119);
      expect(search).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1);
      expect(search).toHaveBeenCalledTimes(1);
      expect(search).toHaveBeenLastCalledWith('aliv');
    });
  });
});
