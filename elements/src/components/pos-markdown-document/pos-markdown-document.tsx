import { SolidFile } from '@pod-os/core';
import { Component, h, Prop, State } from '@stencil/core';

import { marked } from 'marked';
import { sanitize, SanitizedHtml } from './sanitize';
import { RichEditor } from './rich-editor';

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

  async componentWillLoad() {
    const markdown = await this.file.blob().text();
    const html = await marked(markdown);
    this.sanitizedHtml = sanitize(html);
  }

  componentDidLoad() {
    const editor = new RichEditor(this.editorEl, this.sanitizedHtml, this.file.url);
    editor.onUpdate(() => {});
  }

  render() {
    return (
      <article>
        <div ref={el => (this.editorEl = el)}></div>
      </article>
    );
  }
}
