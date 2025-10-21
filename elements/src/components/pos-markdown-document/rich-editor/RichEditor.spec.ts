/**
 * @jest-environment @happy-dom/jest-environment
 *
 * => editor needs a real DOM to work
 */

import { RichEditor } from './RichEditor';
import { Subscription, tap } from 'rxjs';

describe('RichEditor', () => {
  describe('rendering', () => {
    it('basic html', () => {
      const div = document.createElement('div');
      new RichEditor(div, '# Hello World', 'https://pod.test');
      expect(div.children[0].innerHTML).toEqual(`<h1>Hello World</h1>`);
    });

    describe('Images', () => {
      it('renders image as pos-image', () => {
        const div = document.createElement('div');
        new RichEditor(div, '![](https://image.test/image.png)', 'https://pod.test');
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://image.test/image.png" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });

      it('renders image with relative src relative to the base url', () => {
        const div = document.createElement('div');
        new RichEditor(div, '![](image.png)', 'https://pod.test/container/readme.md');
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://pod.test/container/image.png" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });

      it('renders image alt text', () => {
        const div = document.createElement('div');
        new RichEditor(div, '![Some image](https://image.test/image.png)', 'https://pod.test');
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://image.test/image.png" alt="Some image" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });

      it('renders image title', () => {
        const div = document.createElement('div');
        new RichEditor(div, '![](https://image.test/image.png "Some image")', 'https://pod.test');
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://image.test/image.png" title="Some image" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });
    });

    describe('Links', () => {
      it('renders links as pos-rich-link', () => {
        const div = document.createElement('div');
        new RichEditor(div, '[Link text](https://link.test/target)', 'https://pod.test');
        expect(div.children[0].innerHTML).toEqual(
          `<p><pos-rich-link uri="https://link.test/target">Link text</pos-rich-link></p>`,
        );
      });

      it('renders relative links relative to the base URL', () => {
        const div = document.createElement('div');
        new RichEditor(div, '[Link text](other.md)', 'https://pod.test/container/readme.md');
        expect(div.children[0].innerHTML).toEqual(
          `<p><pos-rich-link uri="https://pod.test/container/other.md">Link text</pos-rich-link></p>`,
        );
      });
    });
  });

  describe('editing', () => {
    it('is not editable initially', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, '# Hello World', 'https://pod.test');
      expect(editor.isEditable()).toBe(false);
    });

    it('can start and stop editing', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, '# Hello World', 'https://pod.test');
      editor.startEditing();
      expect(editor.isEditable()).toBe(true);
      editor.stopEditing();
      expect(editor.isEditable()).toBe(false);
    });

    it('is not modified initially', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, '# Hello World', 'https://pod.test');
      expect(editor.isModified()).toBe(false);
    });

    it('is not modified when editing starts, but nothing is changed yet', done => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, '# Hello World\n', 'https://pod.test');
      editor.startEditing();
      expect(editor.isModified()).toBe(false);
      setTimeout(() => {
        expect(editor.isModified()).toBe(false);
        done();
      }, 1);
    });

    it('is not modified by auto-appending an empty paragraph (trailing node)', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, '# Hello World', 'https://pod.test');
      editor.startEditing();
      expect(editor.isModified()).toBe(false);
      expect(editor.getContent()).toEqual('# Hello World\n\n');
    });

    it('is not modified when editing starts and stops without changes', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, '# Hello World\n\n', 'https://pod.test');
      editor.startEditing();
      expect(editor.isModified()).toBe(false);
      editor.stopEditing();
      expect(editor.isModified()).toBe(false);
    });

    it('is modified after content has been changed', async () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, '# Hello World', 'https://pod.test');
      editor.startEditing();
      expect(editor.isModified()).toBe(false);

      // @ts-ignore Accessing a private field here for testing
      const tiptap = editor.editor;
      tiptap.commands.insertContent('Modified ');

      expect(editor.isModified()).toBe(true);
    });

    describe('observe changes', () => {
      let subscription: Subscription;
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
        subscription?.unsubscribe();
      });

      it('debounces changes for 3 seconds', async () => {
        const div = document.createElement('div');
        const editor = new RichEditor(div, '# Hello World\n\n', 'https://pod.test');
        editor.startEditing();
        const save = jest.fn();
        subscription = editor
          .observeChanges()
          .pipe(
            tap(args => {
              save(args);
            }),
          )
          .subscribe();

        // @ts-ignore Accessing a private field here for testing
        const tiptap = editor.editor;
        tiptap.commands.insertContent('Modified ');

        expect(editor.isModified()).toBe(true);
        jest.advanceTimersByTime(999);
        expect(save).toHaveBeenCalledTimes(0);
        expect(editor.isModified()).toBe(true);
        jest.advanceTimersByTime(1);
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenLastCalledWith({
          content: '# Modified Hello World\n\n',
        });
        expect(editor.isModified()).toBe(false);
      });

      it('waits until changes have settled for 3 seconds', async () => {
        const div = document.createElement('div');
        const editor = new RichEditor(div, '# Hello World\n\n', 'https://pod.test');
        editor.startEditing();
        const save = jest.fn();
        subscription = editor
          .observeChanges()
          .pipe(
            tap(args => {
              save(args);
            }),
          )
          .subscribe();

        // @ts-ignore Accessing a private field here for testing
        const tiptap = editor.editor;

        tiptap.commands.insertContent('edit 1 ');
        jest.advanceTimersByTime(999);
        tiptap.commands.insertContent('edit 2 ');
        jest.advanceTimersByTime(999);
        tiptap.commands.insertContent('edit 3 ');

        expect(editor.isModified()).toBe(true);
        expect(save).toHaveBeenCalledTimes(0);
        jest.advanceTimersByTime(1000);
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenLastCalledWith({
          content: '# edit 1 edit 2 edit 3 Hello World\n\n',
        });
        expect(editor.isModified()).toBe(false);
      });
    });
  });
});
