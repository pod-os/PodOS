import { Component, Event, EventEmitter, State, h, Prop } from '@stencil/core';
import { Thing } from '@pod-os/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

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

  @State() isEditing: boolean = false;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  private readonly showFileUpload = () => {
    this.isEditing = true;
  };

  render() {
    if (this.isEditing) {
      return <input type="file" />;
    }

    const pic = this.resource ? this.resource.picture() : null;
    if (!pic) return <slot></slot>;
    return [
      <pos-image blurredBackground={this.blurredBackground} src={pic.url} alt={this.resource.label()}></pos-image>,
      this.resource.editable ? (
        <button class="edit" onClick={this.showFileUpload}>
          Add picture
        </button>
      ) : null,
    ];
  }
}
