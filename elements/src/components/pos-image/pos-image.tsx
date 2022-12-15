import { BrokenFile } from '@pod-os/core';
import { BrokenImage } from './BrokenImage';
import { PodOS } from '@pod-os/core/src';
import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import session from '../../store/session';

@Component({
  tag: 'pos-image',
  styleUrl: 'pos-image.css',
  shadow: true,
})
export class PosImage {
  @Prop() src: string;

  @Prop() alt: string;

  @State() os: PodOS;

  @State()
  private dataUri: string;

  @State()
  private brokenFile: BrokenFile;

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
        this.brokenFile = file as BrokenFile;
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
      return <BrokenImage file={this.brokenFile} />;
    }
    return <img src={this.dataUri} alt={this.alt} />;
  }
}
