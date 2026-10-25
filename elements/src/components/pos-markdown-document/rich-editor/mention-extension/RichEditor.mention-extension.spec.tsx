import { vi } from 'vitest';
import { describe, expect, it } from '@stencil/vitest';

import { RichEditor } from '../RichEditor';
import { PodOS, Thing } from '@pod-os/core';

import './pos-mention-menu/pos-mention-menu';
import { findAllByRole, getByRole, getByText, findByRole } from '@testing-library/dom';
import { when } from 'vitest-when';

describe('RichEditor', () => {
  const search = vi.fn().mockReturnValue([]);
  const mockOs = {
    buildSearchIndex: vi.fn().mockResolvedValue({ search }),
    store: { get: vi.fn() },
    proposeUriForNewThing: vi.fn(),
  } as unknown as PodOS;

  describe('when a thing is mentioned', () => {
    it('shows a pop up to select an indexed item or create a new one', async () => {
      // given a RichEditor
      const root = document.createElement('div');
      const editor = new RichEditor(root, '', 'https://pod.test', mockOs);
      editor.startEditing();
      // @ts-ignore Accessing a private field here for testing
      const tiptap = editor.editor;

      // and PodOS indexed "Test item"
      when(search)
        .calledWith('test')
        .thenReturn([
          {
            ref: 'https://pod.test/test-item#it',
          },
        ]);
      when(mockOs.store.get)
        .calledWith('https://pod.test/test-item#it')
        .thenReturn({
          label: () => 'Test Item',
        } as Thing);

      // when mentioning 'test'
      tiptap.commands.insertContent('#test');

      // then it is inserted in the Editor as a suggestion
      const textbox = getByRole(root, 'textbox');
      const text = getByText(textbox, '#test');
      expect(text).toHaveClass('suggestion');

      // and an option shows up for the matching indexed item
      const listbox = await findByRole(document.body, 'listbox');
      const option = await findAllByRole(listbox, 'option');
      expect(option.length).toBe(2);
      expect(option[0]).toMatchInlineSnapshot(`
          <li
            aria-selected="true"
            class="indexed"
            role="option"
          >
            Test Item
          </li>
        `);

      // and an option shows up to create a new item
      expect(option[1]).toMatchInlineSnapshot(`
          <li
            class="new-thing"
            role="option"
          >
            test
          </li>
        `);
    });
  });
});
