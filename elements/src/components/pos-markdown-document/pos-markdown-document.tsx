import { SolidFile } from '@pod-os/core';
import { Component, h, Prop, State } from '@stencil/core';

import { marked, Renderer } from 'marked';

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

    const renderer = new Renderer();

    renderer.link = ({ href, text }) => {
      const url = new URL(href, this.file.url);
      return `<pos-rich-link uri="${url}">${text}</pos-rich-link>`;
    };

    renderer.image = ({ href, title, text }) => {
      const titleAttr = title ? ` title="${title}"` : '';
      const url = new URL(href, this.file.url);
      return `<pos-image src="${url}" alt="${text}" ${titleAttr}>`;
    };

    marked.setOptions({ renderer });
    this.text = await marked(markdown); // TODO sanitize
  }

  render() {
    return <article innerHTML={this.text}></article>;
  }
}
