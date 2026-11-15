import { Component, EventEmitter, h, Host, State, Event, Listen } from '@stencil/core';
import { SourceEditor } from './source-editor';
import { useResource } from '../../components/events/useResource';

import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import { usePodOS } from '../../components/events/usePodOS';
import { BrokenFile as BrokenFileData, PodOS, SolidFile } from '@pod-os/core';
import { BrokenFile } from '../../components/broken-file/BrokenFile';
import { SaveStatus } from '../../components/pos-save-status/pos-save-status';

/**
 * A tool to edit the source code of a document
 */
@Component({
  tag: 'pos-tool-source-editor',
  styleUrls: ['./pos-tool-source-editor.css', '../../apps/styles/default-app-layout.css'],
  shadow: true,
})
export class PosToolSourceEditor {
  private editorEl!: HTMLElement;

  @State()
  private loading = true;

  @State()
  private brokenFile: BrokenFileData | null = null;

  private editor: SourceEditor | undefined;
  private os!: PodOS;
  private file: SolidFile | undefined;

  @State()
  private saveStatus: SaveStatus = 'idle';

  @Event({ eventName: 'pod-os:error' })
  errorEmitter!: EventEmitter;

  @Listen('pod-os:link', { target: 'document', capture: true })
  @Listen('pod-os:tool-selected', { target: 'document', capture: true })
  @Listen('pod-os:logout', { target: 'document', capture: true })
  confirmNavigation(evt: CustomEvent) {
    if (this.saveStatus !== 'idle') {
      const ok = window.confirm('There are unsaved changes that will be lost, if you proceed.');
      if (!ok) {
        evt.stopPropagation();
      }
    }
  }

  @Listen('beforeunload', { target: 'window' })
  confirmUnload(event: BeforeUnloadEvent) {
    if (this.saveStatus !== 'idle') {
      event.preventDefault();
    }
  }

  async componentDidLoad() {
    this.os = await usePodOS(this.editorEl);
    const resource = await useResource(this.editorEl);
    this.file = await this.os.files().fetchFile(resource.uri);

    const blob = this.file.blob();
    if (blob) {
      const content = await blob.text();
      this.editor = new SourceEditor(this.editorEl!, { content, contentType: blob.type, editable: resource.editable });
      this.editor.onUpdate(() => (this.saveStatus = 'pending'));
    } else {
      this.brokenFile = this.file as BrokenFileData;
    }
    this.loading = false;
  }

  async save() {
    this.saveStatus = 'saving';
    try {
      const response = await this.os.files().putFile(this.file!, this.editor?.getContent() ?? '');
      if (response.ok) {
        this.saveStatus = 'idle';
      } else {
        this.saveStatus = 'failed';
        this.errorEmitter.emit(new Error(`Failed to save file: ${response.status} ${response.statusText}`));
      }
    } catch (err) {
      this.errorEmitter.emit(err);
      this.saveStatus = 'failed';
    }
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
              <div class="saving">
                <button onClick={() => this.save()} disabled={this.saveStatus === 'saving'}>
                  <sl-icon name="cloud-arrow-up"></sl-icon>
                  Save
                </button>
                <pos-save-status saveStatus={this.saveStatus}></pos-save-status>
              </div>
            ) : null}
          </header>
          <div class="content" ref={el => (this.editorEl = el!)}>
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
