import { Component, h, State } from '@stencil/core';
import { SourceEditor } from './source-editor';
import { useResource } from '../../components/events/useResource';

import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import { usePodOS } from '../../components/events/usePodOS';

@Component({
  tag: 'pos-tool-source-editor',
  styleUrl: 'pos-tool-source-editor.css',
})
export class PosToolSourceEditor {
  private editorEl: HTMLElement | undefined;

  @State()
  private loading = true;

  async componentDidLoad() {
    const os = await usePodOS(this.editorEl!);
    const resource = await useResource(this.editorEl!);
    const file = await os.files().fetchFile(resource.uri);
    const content = await file.blob()!.text(); // TODO handle missing blob
    this.loading = false;
    new SourceEditor(this.editorEl!, content);
  }

  render() {
    return (
      <article>
        <div class="content" ref={el => (this.editorEl = el)}>
          {this.loading ? <Skeleton></Skeleton> : null}
        </div>
      </article>
    );
  }
}

function Skeleton() {
  return (
    <div class="skeleton">
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
    </div>
  );
}
