import { vi } from 'vitest';
import { beforeEach, describe, expect, it } from '@stencil/vitest';

import { RichEditor } from '../RichEditor';
import { PodOS, Thing } from '@pod-os/core';

import './pos-mention-menu/pos-mention-menu';
import { findAllByRole, findByRole, getByRole, getByText } from '@testing-library/dom';
import { when } from 'vitest-when';
import { Editor } from '@tiptap/core';
import { userEvent } from '@testing-library/user-event';

describe('RichEditor', () => {
  const search = vi.fn().mockReturnValue([]);
  const mockOs = {
    buildSearchIndex: vi.fn().mockResolvedValue({ search }),
    store: { get: vi.fn() },
    proposeUriForNewThing: vi.fn(),
  } as unknown as PodOS;

  describe('when a thing is mentioned', () => {
    let root: HTMLElement;
    let tiptap: Editor;
    beforeEach(() => {
      // given a RichEditor
      root = document.createElement('div');
      document.body.appendChild(root);
      const editor = new RichEditor(root, '', 'https://pod.test', mockOs);
      editor.startEditing();
      // @ts-ignore Accessing a private field here for testing
      tiptap = editor.editor;

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
    });

    it('controls nothing initially', () => {
      const textbox = getByRole(root, 'textbox');
      expect(textbox).not.toHaveAttribute('aria-controls');
    });

    it('shows a pop up to select an indexed item or create a new one', async () => {
      // when mentioning 'test'
      tiptap.commands.insertContent('#test');

      // then it is inserted in the Editor as a suggestion
      const textbox = getByRole(root, 'textbox');
      const text = getByText(textbox, '#test');
      expect(text).toHaveClass('suggestion');

      // then a listbox pops up controlled by the editor
      const listbox = await findByRole(root, 'listbox');
      expect(listbox).toHaveAttribute('id', 'pos-mention-menu-listbox');
      expect(textbox).toHaveAttribute('aria-controls', 'pos-mention-menu-listbox');

      // and an option shows up for the matching indexed item
      const option = await findAllByRole(listbox, 'option');
      expect(option.length).toBe(2);
      expect(option[0]).toMatchInlineSnapshot(`
        <li
          aria-selected="true"
          class="indexed"
          id="pos-mention-menu-option-1"
          role="option"
        >
          Test Item
        </li>
      `);

      // and the first option is the active descendant of the editor
      expect(textbox).toHaveAttribute('aria-activedescendant', 'pos-mention-menu-option-1');

      // and an option shows up to create a new item
      expect(option[1]).toMatchInlineSnapshot(`
        <li
          class="new-thing"
          id="pos-mention-menu-option-2"
          role="option"
        >
          test
        </li>
      `);
    });

    it('closes the suggestions when ESC is pressed', async () => {
      // given 'test' was mentioned
      tiptap.commands.insertContent('#test');

      // and the listbox popped up
      const textbox = getByRole(root, 'textbox');
      const listbox = await findByRole(root, 'listbox');
      expect(listbox).toBeVisible();

      // when pressing ESC to dismiss it
      await userEvent.type(textbox, '{Esc}');

      // then it disappears
      expect(listbox).not.toBeVisible();

      // and the editor does not announce it controls a listbox anymore
      expect(textbox).not.toHaveAttribute('aria-controls');
      // and it has no active descendant
      expect(textbox).not.toHaveAttribute('aria-activedescendant');
    });

    it('down arrow key selects next option', async () => {
      // given 'test' was mentioned
      tiptap.commands.insertContent('#test');

      // and the listbox popped up
      const textbox = getByRole(root, 'textbox');
      const listbox = await findByRole(root, 'listbox');
      expect(listbox).toBeVisible();

      // when pressing down arrow
      await userEvent.type(textbox, '{ArrowDown}');

      // then the second option becomes active
      const option = await findAllByRole(listbox, 'option');
      expect(option.length).toBe(2);
      expect(textbox).toHaveAttribute('aria-activedescendant', 'pos-mention-menu-option-2');
      expect(option[1]).toMatchInlineSnapshot(`
        <li
          aria-selected="true"
          class="new-thing"
          id="pos-mention-menu-option-2"
          role="option"
        >
          test
        </li>
      `);
    });

    it('up arrow key selects previous option (wrapping around to the last)', async () => {
      // given 'test' was mentioned
      tiptap.commands.insertContent('#test');

      // and the listbox popped up
      const textbox = getByRole(root, 'textbox');
      const listbox = await findByRole(root, 'listbox');
      expect(listbox).toBeVisible();

      // when pressing down arrow
      await userEvent.type(textbox, '{ArrowUp}');

      // then the second option becomes active
      const option = await findAllByRole(listbox, 'option');
      expect(option.length).toBe(2);
      expect(textbox).toHaveAttribute('aria-activedescendant', 'pos-mention-menu-option-2');
      expect(option[1]).toMatchInlineSnapshot(`
        <li
          aria-selected="true"
          class="new-thing"
          id="pos-mention-menu-option-2"
          role="option"
        >
          test
        </li>
      `);
    });
  });
});
