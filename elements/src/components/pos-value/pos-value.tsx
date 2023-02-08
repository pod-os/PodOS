import { Thing } from '@pod-os/core';
import { Component, Event, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-value',
  shadow: true,
})
export class PosValue implements ResourceAware {
  /**
   * URI of the predicate to get the value from
   */
  @Prop() predicate: string;
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    return this.resource ? this.resource.anyValue(this.predicate) : null;
  }
}
