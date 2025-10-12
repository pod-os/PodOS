import { SolidFile } from '@pod-os/core';
import { Component, h, Method, Prop, State } from '@stencil/core';

import { marked } from 'marked';
import { sanitize, SanitizedHtml } from './sanitize';
import { RichEditor } from './rich-editor';

import './shoelace';

@Component({
  tag: 'pos-markdown-document',
  styleUrls: ['pos-markdown-document.css', '../../apps/styles/article-card.css'],
  shadow: true,
})
export class PosMarkdownDocument {
  /**
   * The file to show / edit
   */
  @Prop()
  file: SolidFile;

  /**
   * Whether the current user has the permission to edit the file
   */
  @Prop()
  editable: boolean = false;

  @State()
  private sanitizedHtml: SanitizedHtml;

  private editorEl: HTMLElement;

  @State()
  private isModified: boolean = false;

  private editor: RichEditor;

  @State()
  private isEditing: boolean = false;

  async componentWillLoad() {
    const markdown = await this.file.blob().text();
    const html = await marked(markdown);
    this.sanitizedHtml = sanitize(html);
  }

  componentDidLoad() {
    this.editor = new RichEditor(this.editorEl, this.sanitizedHtml, this.file.url);
    this.editor.onUpdate(() => {
      this.isModified = this.editor.isModified();
    });
  }

  /**
   * Switch to editing mode
   */
  @Method()
  startEditing() {
    this.editor.startEditing();
    this.isEditing = true;
  }

  /**
   * Switch to view mode
   */
  @Method()
  stopEditing() {
    this.editor.stopEditing();
    this.isEditing = false;
  }

  render() {
    return (
      <article>
        {this.editable ? (
          <header>
            {this.isEditing ? (
              <button onClick={() => this.stopEditing()}>
                <sl-icon name="eye"></sl-icon>View
              </button>
            ) : (
              <button onClick={() => this.startEditing()}>
                <sl-icon name="pencil-square"></sl-icon>Edit
              </button>
            )}
          </header>
        ) : null}
        <div ref={el => (this.editorEl = el)}></div>
        {this.isEditing ? this.getFooter() : null}
      </article>
    );
  }

  private getFooter() {
    return (
      <footer>
        {this.isModified ? (
          <span class="status">
            <sl-icon name="clock-history"></sl-icon>pending changes
          </span>
        ) : (
          <span class="status">
            <sl-icon name="check2-circle"></sl-icon>all saved
          </span>
        )}
      </footer>
    );
  }
}
