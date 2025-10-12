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
  @Prop()
  file: SolidFile;

  @State()
  private sanitizedHtml: SanitizedHtml;

  private editorEl: HTMLElement;

  @State()
  private isModified: boolean = false;

  private editor: RichEditor;

  @State()
  private isEditable: boolean = false;

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

  @Method()
  startEditing() {
    this.editor.startEditing();
    this.isEditable = true;
  }

  render() {
    return (
      <article>
        <div ref={el => (this.editorEl = el)}></div>
        {this.isEditable ? this.getFooter() : null}
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
