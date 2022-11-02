import { Relation, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-relations',
  shadow: true,
})
export class PosRelations implements ResourceAware {
  @State() data: Relation[] = [];

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.data = resource.relations();
  };

  render() {
    const items = this.data.map(it => (
      <ion-item-group>
        <ion-item-divider>
          <ion-label>{it.predicate}</ion-label>
        </ion-item-divider>
        {it.uris.map(uri => (
          <pos-rich-link uri={uri} />
        ))}
      </ion-item-group>
    ));
    return this.data.length > 0 ? <ion-list>{items}</ion-list> : null;
  }
}
