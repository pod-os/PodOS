import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { PosImageNode } from './PosImageNode';
import { PosRichLinkMark } from './PosRichLinkMark';
import { SanitizedHtml } from '../sanitize';
import { BehaviorSubject, tap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class RichEditor {
  private readonly editor: Editor;

  /**
   * Whether the editor has been modified since the latest changes have been observed
   * @private
   */
  private modified = false;

  private editingJustChanged = false;
  private readonly modifications = new BehaviorSubject<{ content: string }>({ content: '' });

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
    this.editor.on('update', () => {
      if (this.editingJustChanged) {
        this.editingJustChanged = false;
        return;
      }
      this.modified = true;
      this.modifications.next({ content: this.editor.getHTML() });
    });
  }

  onUpdate(callback: () => void) {
    this.editor.on('update', callback);
  }

  isEditable() {
    return this.editor.isEditable;
  }

  startEditing() {
    this.editingJustChanged = true;
    this.editor.setEditable(true);
    this.editor.commands.focus();
  }

  stopEditing() {
    this.editingJustChanged = true;
    this.editor.setEditable(false);
  }

  isModified() {
    return this.modified;
  }

  getContent() {
    return this.editor.getHTML();
  }

  /**
   * Provides an observable that communicates the latest editor content after changes have settled
   * @param debounce - time (in millisecond) that has to pass without further modifications, until the changes are communicated
   */
  observeChanges(debounce: number = 1000) {
    return this.modifications.pipe(
      debounceTime(debounce),
      tap(() => (this.modified = false)),
    );
  }
}
