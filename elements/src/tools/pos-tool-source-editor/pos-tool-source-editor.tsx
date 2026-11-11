import { Component, h } from '@stencil/core';
import { SourceEditor } from './source-editor';

@Component({
  tag: 'pos-tool-source-editor',
})
export class PosToolSourceEditor {
  private editorEl: HTMLElement | undefined;

  componentDidLoad() {
    new SourceEditor(this.editorEl!);
  }

  render() {
    return (
      <article>
        <div class="content" ref={el => (this.editorEl = el)}></div>
      </article>
    );
  }
}
