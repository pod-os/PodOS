import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { PosImageNode } from './PosImageNode';
import { PosRichLinkMark } from './PosRichLinkMark';
import { SanitizedHtml } from '../sanitize';

export class RichEditor {
  private readonly editor: Editor;

  /**
   * @param target The element to render to
   * @param content The content to show in the editor
   * @param baseUrl Base URL for relative links and relative image src
   */
  constructor(target: HTMLElement, content: SanitizedHtml, baseUrl: string) {
    this.editor = new Editor({
      element: target,
      extensions: [StarterKit.configure({ link: false }), PosImageNode(baseUrl), PosRichLinkMark(baseUrl)],
      content: content.value,
      editable: false,
    });
  }

  onUpdate(callback: () => void) {
    this.editor.on('update', callback);
  }
}
