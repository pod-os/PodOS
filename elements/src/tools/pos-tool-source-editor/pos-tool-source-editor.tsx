import { Component, h, Host, State } from '@stencil/core';
import { SourceEditor } from './source-editor';
import { useResource } from '../../components/events/useResource';

import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import { usePodOS } from '../../components/events/usePodOS';
import { BrokenFile as BrokenFileData } from '@pod-os/core';
import { BrokenFile } from '../../components/broken-file/BrokenFile';

/**
 * A tool to edit the source code of a document
 */
@Component({
  tag: 'pos-tool-source-editor',
  styleUrls: ['./pos-tool-source-editor.css', '../../apps/styles/default-app-layout.css'],
  shadow: true,
})
export class PosToolSourceEditor {
  private editorEl: HTMLElement | undefined;

  @State()
  private loading = true;

  @State()
  private brokenFile: BrokenFileData | null = null;

  async componentDidLoad() {
    const os = await usePodOS(this.editorEl!);
    const resource = await useResource(this.editorEl!);
    const file = await os.files().fetchFile(resource.uri);

    const blob = file.blob();
    if (blob) {
      const content = await blob.text();
      new SourceEditor(this.editorEl!, content, blob.type);
    } else {
      this.brokenFile = file as BrokenFileData;
    }
    this.loading = false;
  }

  render() {
    if (this.brokenFile) {
      return <BrokenFile file={this.brokenFile} />;
    }
    return (
      <Host>
        <section>
          <div class="content" ref={el => (this.editorEl = el)}>
            {this.loading ? <Skeleton></Skeleton> : null}
          </div>
        </section>
      </Host>
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
