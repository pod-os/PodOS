import { BrokenFile as BrokenFileData, PodOS } from '@pod-os/core';
import { BrokenFile } from '../broken-file/BrokenFile';
import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import session from '../../store/session';

/**
 * Tries fetch an image with the solid authentication, and can visualize http errors like 403 or 404 if this fails.
 * Falls back to classic `<img src="...">` on network errors like CORS.
 * Renders a normal link if even this fails.
 */
@Component({
  tag: 'pos-image',
  styleUrl: 'pos-image.css',
  shadow: true,
})
export class PosImage {
  @Prop() src: string;

  @Prop() alt: string;

  /**
   * Use a blurred version of the image as its own background, if the image is scaled down to fit into the container.
   */
  @Prop() blurredBackground: boolean = false;

  @State() os: PodOS;

  @State()
  private dataUri: string;

  @State()
  private brokenFile: BrokenFileData;

  @State()
  private networkError: Error;

  @State()
  private imageError: Event;

  @State()
  private loading: boolean = true;

  @Event({ eventName: 'pod-os:init' }) initializeOsEmitter: EventEmitter;

  /**
   * Indicates that the resource given in `src` property has been loaded.
   */
  @Event({ eventName: 'pod-os:resource-loaded' }) resourceLoadedEmitter: EventEmitter<string>;

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
      this.imageError = null;
      this.networkError = null;
      this.brokenFile = null;
      const file = await this.os.files().fetchFile(this.src);
      this.resourceLoadedEmitter.emit(this.src);
      if (file.blob()) {
        this.dataUri = URL.createObjectURL(file.blob());
      } else {
        this.brokenFile = file as BrokenFileData;
      }
    } catch (err) {
      this.networkError = err;
    } finally {
      this.loading = false;
    }
  }

  onImageError(err: Event) {
    this.networkError = null;
    this.imageError = err;
  }

  render() {
    if (this.loading) {
      return <ion-skeleton-text animated={true}></ion-skeleton-text>;
    }
    if (this.networkError) {
      // probably a CORS error
      return <img alt={this.alt} src={this.src} onError={err => this.onImageError(err)} />;
    }
    if (this.brokenFile) {
      // fetching worked, but HTTP response was not ok
      return <BrokenFile file={this.brokenFile} />;
    }
    if (this.imageError) {
      // if even the loading via classic <img src="..."> failed, render a link
      return (
        <div class="error">
          <a href={this.src}>{this.src}</a>
        </div>
      );
    }

    return (
      <Host
        style={{
          backgroundImage: this.blurredBackground ? `url('${this.dataUri}')` : null,
        }}
      >
        <img src={this.dataUri} alt={this.alt} />
      </Host>
    );
  }
}
