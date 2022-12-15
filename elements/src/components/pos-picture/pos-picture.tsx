import { Component, Event, EventEmitter, State, h } from '@stencil/core';
import { Thing } from '@pod-os/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-picture',
  shadow: true,
  styleUrl: 'pos-picture.css',
})
export class PosPicture implements ResourceAware {
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    const pic = this.resource ? this.resource.picture() : null;
    if (!pic) return null;
    return <pos-image src={pic.url} alt={this.resource.label()}></pos-image>;
  }
}
