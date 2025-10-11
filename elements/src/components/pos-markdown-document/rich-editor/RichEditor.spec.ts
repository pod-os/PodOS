/**
 * @jest-environment @happy-dom/jest-environment
 *
 * => editor needs a real DOM to work
 */

import { RichEditor } from './RichEditor';

describe('RichEditor', () => {
  it('renders basic html', () => {
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
      new RichEditor(div, { value: '<img alt="Some image" src="https://image.test/image.png" />' }, 'https://pod.test');
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
