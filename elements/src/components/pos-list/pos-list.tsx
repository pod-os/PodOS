import { Thing } from '@pod-os/core';
import { Component, Event, h, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-list',
  shadow: false,
})
export class PosList implements ResourceAware {
  /**
   * URI of the predicate to follow
   */
  @Prop() rel: string;

  @State() resource: Thing;
  @State() items: string[] = [];

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.items = []
    if (this.rel) this.items = resource.relations().filter(relation => relation.predicate == this.rel).flatMap(relation => relation.uris);
  };

  render() {
    const elems = this.items.map(it => (
      <div>Test</div>
    ));
    return this.items.length > 0 ? elems : null;
  }
}

