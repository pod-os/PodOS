import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pos-description',
  shadow: true,
})
export class PosDescription {
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    return this.resource ? this.resource.description() : null;
  }
}
