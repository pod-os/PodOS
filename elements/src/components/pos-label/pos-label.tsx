import { Component, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pos-label',
  shadow: true,
})
export class PosLabel {
  @State() resource: any;

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: any) => {
    this.resource = resource;
  };

  render() {
    return this.resource ? this.resource.label() : null;
  }
}
