import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-description',
  shadow: true,
})
export class PosDescription implements ResourceAware {
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    return this.resource ? this.resource.description() : null;
  }
}
