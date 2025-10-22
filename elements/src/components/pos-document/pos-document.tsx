import { PodOS, BrokenFile as BrokenFileData, SolidFile } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Listen, Prop, State, Watch } from '@stencil/core';
import session from '../../store/session';
import { BrokenFile } from '../broken-file/BrokenFile';

@Component({
  tag: 'pos-document',
  styleUrl: 'pos-document.css',
  shadow: true,
})
export class PosDocument {
  @Prop() src: string;

  @Prop() alt: string;

  @State() os: PodOS;

  @State()
  private file: SolidFile;

  @State()
  private brokenFile: BrokenFileData;

  @State()
  private error: Error;

  @State()
  private saveStatus: 'idle' | 'pending' | 'failed' = 'idle';

  @State()
  private loading: boolean = true;

  @State()
  private isEditable: boolean = false;

  @Event({ eventName: 'pod-os:init' }) initializeOsEmitter: EventEmitter;

  /**
   * Indicates that the resource given in `src` property has been loaded.
   */
  @Event({ eventName: 'pod-os:resource-loaded' }) resourceLoadedEmitter: EventEmitter<string>;

  /**
   * Emitted when an error occurs during file operations.
   */
  @Event({ eventName: 'pod-os:error' }) errorEmitter: EventEmitter<Error>;

  componentWillLoad() {
    session.onChange('isLoggedIn', () => this.fetchBlob());
    this.initializeOsEmitter.emit(this.setOs);
  }

  setOs = async (os: PodOS) => {
    this.os = os;
  };

  @Listen('pod-os:document-modified')
  async handleDocumentModified(event: CustomEvent) {
    const { file, newContent } = event.detail;
    try {
      this.saveStatus = 'pending';
      const response = await this.os.files().putFile(file, newContent);
      if (response.ok) {
        this.saveStatus = 'idle';
      } else {
        this.saveStatus = 'failed';
        const error = new Error(`Failed to save file: ${response.status} ${response.statusText}`);
        this.errorEmitter.emit(error);
      }
    } catch (error) {
      this.saveStatus = 'failed';
      this.errorEmitter.emit(error);
    }
  }

  @Watch('os')
  @Watch('src')
  async fetchBlob() {
    try {
      this.loading = true;
      const file = await this.os.files().fetchFile(this.src);
      const thing = this.os.store.get(this.src);
      this.isEditable = thing?.editable;
      this.resourceLoadedEmitter.emit(this.src);
      if (file.blob()) {
        this.file = file;
        this.error = null;
      } else {
        this.brokenFile = file as BrokenFileData;
      }
    } catch (err) {
      this.error = err;
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return <ion-skeleton-text animated={true}></ion-skeleton-text>;
    }
    if (this.error) {
      return <div class="error">{this.error.message}</div>;
    }
    if (this.brokenFile) {
      return <BrokenFile file={this.brokenFile} />;
    }
    if (this.file.blob().type === 'text/markdown') {
      return (
        <pos-markdown-document
          editable={this.isEditable}
          saveStatus={this.saveStatus}
          file={this.file}
        ></pos-markdown-document>
      );
    } else {
      return <iframe src={URL.createObjectURL(this.file.blob())}></iframe>;
    }
  }
}
