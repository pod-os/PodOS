import { Component, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pos-description',
  shadow: true,
})
export class PosDescription {
  @State() resource: any;

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: any) => {
    this.resource = resource;
  };

  render() {
    return this.resource ? this.resource.description() : null;
  }
}
