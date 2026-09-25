import { Editor, mergeAttributes } from '@tiptap/core';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { PosImageNode } from './PosImageNode';
import { PosRichLinkMark } from './PosRichLinkMark';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Mention from '@tiptap/extension-mention';

export class RichEditor {
  private readonly editor: Editor;

  private readonly modifications = new Subject<{ content: string }>();

  /**
   * @param target The element to render to
   * @param content The content to show in the editor
   * @param baseUrl Base URL for relative links and relative image src
   */
  constructor(target: HTMLElement, content: string, baseUrl: string) {
    this.editor = new Editor({
      element: target,
      extensions: [
        Markdown,
        StarterKit.configure({ link: false }),
        PosImageNode(baseUrl),
        PosRichLinkMark(baseUrl),
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          renderHTML({ options, node }) {
            return ['pos-rich-link', mergeAttributes({ uri: node.attrs.id }, options.HTMLAttributes), node.attrs.label];
          },
          suggestion: {
            char: '#',
            items: ({ query }) => {
              return [
                { id: 'http://localhost:3000/alice/profile/card#me', label: 'Alice' },
                { id: 'http://localhost:3000/bob/profile/card#me', label: 'Bob' },
                { id: 'http://localhost:3000/carol/profile/card#me', label: 'Carol' },
              ].filter(person => person.label.toLowerCase().includes(query.toLowerCase()));
            },

            render: () => {
              let popup: HTMLElement;
              let unmount: () => void | undefined;
              return {
                onStart: props => {
                  popup = document.createElement('sl-menu');
                  props.items.forEach(item => {
                    const button = document.createElement('sl-menu-item');
                    button.textContent = item.label;
                    button.addEventListener('click', () => props.command(item));
                    popup.appendChild(button);
                  });
                  unmount = props.mount(popup);
                },
                onUpdate: props => {
                  popup.innerHTML = '';
                  props.items.forEach(item => {
                    const button = document.createElement('sl-menu-item');
                    button.textContent = item.label;
                    button.addEventListener('click', () => props.command(item));
                    popup.appendChild(button);
                  });
                },
                onExit: () => {
                  unmount?.();
                  popup.remove();
                },
              };
            },
          },
        }),
      ],
      content,
      contentType: 'markdown',
      editable: false,
    });
    this.editor.on('update', () => {
      this.modifications.next({ content: this.editor.getMarkdown() });
    });
  }

  onUpdate(callback: () => void) {
    this.editor.on('update', callback);
  }

  isEditable() {
    return this.editor.isEditable;
  }

  startEditing() {
    this.editor.setEditable(true, false);
    this.editor.commands.focus();
  }

  stopEditing() {
    this.editor.setEditable(false, false);
  }

  getContent() {
    return this.editor.getMarkdown();
  }

  /**
   * Provides an observable that communicates the latest editor content after changes have settled
   * @param debounce - time (in millisecond) that has to pass without further modifications, until the changes are communicated
   */
  observeChanges(debounce: number = 1000) {
    return this.modifications.pipe(debounceTime(debounce));
  }
}
