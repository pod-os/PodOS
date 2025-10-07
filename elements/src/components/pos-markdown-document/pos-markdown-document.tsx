import { SolidFile } from '@pod-os/core';
import { Component, h, Prop, State } from '@stencil/core';

import { marked } from 'marked';

@Component({
  tag: 'pos-markdown-document',
  styleUrls: ['pos-markdown-document.css', '../../apps/styles/article-card.css'],
  shadow: true,
})
export class PosMarkdownDocument {
  @Prop()
  file: SolidFile;

  @State()
  text: string;

  async componentWillLoad() {
    const markdown = await this.file.blob().text();
    this.text = await marked(markdown); // TODO sanitize
  }

  render() {
    return <article innerHTML={this.text}></article>;
  }
}
