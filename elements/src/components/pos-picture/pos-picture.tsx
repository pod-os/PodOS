import { Component, Event, EventEmitter, State, h, Prop } from '@stencil/core';
import { Thing } from '@pod-os/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

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

  @State() resource: Thing;

  @State() isUploading: boolean = false;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
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
    return <pos-upload onPod-os:files-selected={this.exitUploadMode}></pos-upload>;
  }

  private renderPicture() {
    const picture = this.resource?.picture();

    if (!picture) {
      return [
        <slot></slot>,
        this.resource?.editable ? (
          <button class="add" onClick={this.enterUploadMode}>
            <sl-icon name="cloud-plus"></sl-icon>Upload picture
          </button>
        ) : null,
      ];
    }

    return [
      <pos-image blurredBackground={this.blurredBackground} src={picture.url} alt={this.resource.label()}></pos-image>,
      this.resource.editable ? (
        <button class="add" onClick={this.enterUploadMode}>
          <sl-icon name="cloud-plus"></sl-icon>Upload picture
        </button>
      ) : null,
    ];
  }

  render() {
    return this.isUploading ? this.renderUpload() : this.renderPicture();
  }
}
