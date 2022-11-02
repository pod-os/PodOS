import { Component, Event, EventEmitter, State, h } from '@stencil/core';
import { Thing } from '@pod-os/core';

@Component({
  tag: 'pos-picture',
  shadow: true,
  styleUrl: 'pos-picture.css',
})
export class PosPicture {
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    const pic = this.resource ? this.resource.picture() : null;
    if (!pic) return null;
    return <pos-image src={pic.url}></pos-image>;
  }
}
