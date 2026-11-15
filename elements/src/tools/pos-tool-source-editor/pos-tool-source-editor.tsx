import { Component, h, Host, State } from '@stencil/core';
import { SourceEditor } from './source-editor';
import { useResource } from '../../components/events/useResource';

import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import { usePodOS } from '../../components/events/usePodOS';
import { BrokenFile as BrokenFileData, PodOS, SolidFile } from '@pod-os/core';
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

  private editor: SourceEditor | undefined;
  private os: PodOS | undefined;
  private file: SolidFile | undefined;

  @State()
  private saveStatus: 'idle' | 'saving' | 'failed' = 'idle';

  async componentDidLoad() {
    this.os = await usePodOS(this.editorEl!);
    const resource = await useResource(this.editorEl!);
    this.file = await this.os.files().fetchFile(resource.uri);

    const blob = this.file.blob();
    if (blob) {
      const content = await blob.text();
      this.editor = new SourceEditor(this.editorEl!, { content, contentType: blob.type, editable: resource.editable });
    } else {
      this.brokenFile = this.file as BrokenFileData;
    }
    this.loading = false;
  }

  async save() {
    this.saveStatus = 'saving';
    await this.os?.files().putFile(this.file!, this.editor?.getContent() ?? '');
    this.saveStatus = 'idle';
  }

  render() {
    if (this.brokenFile) {
      return <BrokenFile file={this.brokenFile} />;
    }
    return (
      <Host>
        <section class="editor">
          <header>
            {this.editor?.isEditable() ? (
              <button onClick={() => this.save()} disabled={this.saveStatus === 'saving'}>
                <sl-icon name={this.saveStatus === 'saving' ? 'hourglass-split' : 'cloud-arrow-up'}></sl-icon>
                {this.saveStatus === 'saving' ? 'Saving…' : 'Save'}
              </button>

            ) : null}
          </header>
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
