import { Component, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pos-literals',
  shadow: true,
})
export class PosLiterals {
  @State() resource: any;

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: any) => {
    this.resource = resource;
  };

  render() {
    return this.resource ? <pre>${JSON.stringify(this.resource.literals(), null, 2)}</pre> : null;
  }
}
