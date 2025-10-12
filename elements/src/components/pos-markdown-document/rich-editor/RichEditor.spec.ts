/**
 * @jest-environment @happy-dom/jest-environment
 *
 * => editor needs a real DOM to work
 */

import { RichEditor } from './RichEditor';
import { getByRole } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('RichEditor', () => {
  describe('rendering', () => {
    it('basic html', () => {
      const div = document.createElement('div');
      new RichEditor(div, { value: '<h1>Hello World</h1>' }, 'https://pod.test');
      expect(div.children[0].innerHTML).toEqual(`<h1>Hello World</h1>`);
    });

    describe('Images', () => {
      it('renders image as pos-image', () => {
        const div = document.createElement('div');
        new RichEditor(div, { value: '<img src="https://image.test/image.png" />' }, 'https://pod.test');
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://image.test/image.png" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });

      it('renders image with relative src relative to the base url', () => {
        const div = document.createElement('div');
        new RichEditor(div, { value: '<img src="image.png" />' }, 'https://pod.test/container/readme.md');
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://pod.test/container/image.png" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });

      it('renders image alt text', () => {
        const div = document.createElement('div');
        new RichEditor(
          div,
          { value: '<img alt="Some image" src="https://image.test/image.png" />' },
          'https://pod.test',
        );
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://image.test/image.png" alt="Some image" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });

      it('renders image title', () => {
        const div = document.createElement('div');
        new RichEditor(
          div,
          { value: '<img title="Some image" src="https://image.test/image.png" />' },
          'https://pod.test',
        );
        expect(div.children[0].innerHTML).toEqual(
          `<pos-image src="https://image.test/image.png" title="Some image" contenteditable="false" class="ProseMirror-selectednode"></pos-image>`,
        );
      });
    });

    describe('Links', () => {
      it('renders links as pos-rich-link', () => {
        const div = document.createElement('div');
        new RichEditor(div, { value: '<a href="https://link.test/target">Link text</a>' }, 'https://pod.test');
        expect(div.children[0].innerHTML).toEqual(
          `<p><pos-rich-link uri="https://link.test/target">Link text</pos-rich-link></p>`,
        );
      });

      it('renders relative links relative to the base URL', () => {
        const div = document.createElement('div');
        new RichEditor(div, { value: '<a href="other.md">Link text</a>' }, 'https://pod.test/container/readme.md');
        expect(div.children[0].innerHTML).toEqual(
          `<p><pos-rich-link uri="https://pod.test/container/other.md">Link text</pos-rich-link></p>`,
        );
      });
    });
  });

  describe('editing', () => {
    it('is not editable initially', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, { value: '<h1>Hello World</h1>' }, 'https://pod.test');
      expect(editor.isEditable()).toBe(false);
    });

    it('can start and stop editing', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, { value: '<h1>Hello World</h1>' }, 'https://pod.test');
      editor.startEditing();
      expect(editor.isEditable()).toBe(true);
      editor.stopEditing();
      expect(editor.isEditable()).toBe(false);
    });

    it('is not modified initially', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, { value: '<h1>Hello World</h1>' }, 'https://pod.test');
      expect(editor.isModified()).toBe(false);
    });

    it('is not modified when editing starts, but nothing is changed yet', done => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, { value: '<h1>Hello World</h1><p></p>' }, 'https://pod.test');
      editor.startEditing();
      expect(editor.isModified()).toBe(false);
      setTimeout(() => {
        expect(editor.isModified()).toBe(false);
        done();
      }, 1);
    });

    it('is modified by auto-appending an empty paragraph (trailing node)', done => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, { value: '<h1>Hello World</h1>' }, 'https://pod.test');
      editor.startEditing();
      expect(editor.isModified()).toBe(false);
      setTimeout(() => {
        expect(editor.isModified()).toBe(true);
        expect(editor.getContent()).toEqual('<h1>Hello World</h1><p></p>');
        done();
      }, 1);
    });

    it('is not modified when editing starts and stops without changes', () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, { value: '<h1>Hello World</h1>' }, 'https://pod.test');
      editor.startEditing();
      expect(editor.isModified()).toBe(false);
      editor.stopEditing();
      expect(editor.isModified()).toBe(false);
    });

    it('is modified after content has been changed', async () => {
      const div = document.createElement('div');
      const editor = new RichEditor(div, { value: '<h1>Hello World</h1>' }, 'https://pod.test');
      editor.startEditing();
      const heading = getByRole(div, 'heading', { name: 'Hello World' });
      await userEvent.type(heading, 'Modified');
      expect(editor.isModified()).toBe(true);
    });
  });
});
