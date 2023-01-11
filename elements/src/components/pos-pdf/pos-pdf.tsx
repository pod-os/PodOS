import { BrokenFile as BrokenFileData } from '@pod-os/core';
import { PodOS } from '@pod-os/core/src';
import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import session from '../../store/session';
import { BrokenFile } from '../broken-file/BrokenFile';

@Component({
  tag: 'pos-pdf',
  styleUrl: 'pos-pdf.css',
  shadow: true,
})
export class PosPdf {
  @Prop() src: string;

  @Prop() alt: string;

  @State() os: PodOS;

  @State()
  private dataUri: string;

  @State()
  private brokenFile: BrokenFileData;

  @State()
  private error: Error;

  @State()
  private loading: boolean = true;

  @Event({ eventName: 'pod-os:init' }) initializeOsEmitter: EventEmitter;

  componentWillLoad() {
    session.onChange('isLoggedIn', () => this.fetchBlob());
    this.initializeOsEmitter.emit(this.setOs);
  }

  setOs = async (os: PodOS) => {
    this.os = os;
  };

  @Watch('os')
  @Watch('src')
  async fetchBlob() {
    try {
      this.loading = true;
      const file = await this.os.fetchFile(this.src);
      if (file.blob()) {
        this.dataUri = URL.createObjectURL(file.blob());
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
    return <iframe src={this.dataUri} />;
  }
}
