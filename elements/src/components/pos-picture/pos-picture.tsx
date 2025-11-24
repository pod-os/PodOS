import { Component, Element, Event, EventEmitter, State, h, Prop } from '@stencil/core';
import { PodOS, Thing } from '@pod-os/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { usePodOS } from '../events/usePodOS';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@Component({
  tag: 'pos-picture',
  shadow: true,
  styleUrl: 'pos-picture.css',
})
export class PosPicture implements ResourceAware {
  /**
   * Use a blurred version of the image as its own background, if the image is scaled down to fit into the container.
   */
  @Prop() blurredBackground: boolean = false;

  /**
   * Disable the upload functionality.
   */
  @Prop() noUpload: boolean = false;

  @Element() el: HTMLElement;

  @State() resource: Thing;

  @State() os: PodOS;

  @State() isUploading: boolean = false;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  async componentWillLoad() {
    subscribeResource(this);
    this.os = await usePodOS(this.el);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  private readonly enterUploadMode = () => {
    this.isUploading = true;
  };

  private readonly exitUploadMode = () => {
    this.isUploading = false;
  };

  private renderUpload() {
    return (
      <div>
        <pos-upload
          uploader={(file: File) => {
            return this.os.uploadAndAddPicture(this.resource, file);
          }}
        ></pos-upload>
        <button onClick={() => this.exitUploadMode()}>Close upload</button>
      </div>
    );
  }

  private shouldShowUploadButton(): boolean {
    return this.resource?.editable === true && !this.noUpload;
  }

  private renderUploadButton() {
    if (!this.shouldShowUploadButton()) {
      return null;
    }

    return (
      <button class="add" onClick={this.enterUploadMode}>
        <sl-icon name="cloud-plus"></sl-icon>Upload picture
      </button>
    );
  }

  private renderPicture() {
    const picture = this.resource?.picture();

    if (!picture) {
      return (
        <div class="no-picture">
          <slot></slot>
          {this.renderUploadButton()}
        </div>
      );
    }

    return [
      <pos-image blurredBackground={this.blurredBackground} src={picture.url} alt={this.resource.label()}></pos-image>,
      this.renderUploadButton(),
    ];
  }

  render() {
    return this.isUploading ? this.renderUpload() : this.renderPicture();
  }
}
