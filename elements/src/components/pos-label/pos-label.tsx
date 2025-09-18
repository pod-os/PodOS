import { Thing } from '@pod-os/core';
import { Component, Event, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

/**
 * Displays a human-readable label of the resource, provided by [Thing.label()](https://pod-os.org/reference/core/classes/thing/#label)
 */
@Component({
  tag: 'pos-label',
  shadow: true,
})
export class PosLabel implements ResourceAware {
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
    return this.resource ? this.resource.label() : null;
  }
}
