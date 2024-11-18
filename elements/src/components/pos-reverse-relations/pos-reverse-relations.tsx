import { Relation, Thing } from '@pod-os/core';
import { Component, h, Event, EventEmitter, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-reverse-relations',
  shadow: true,
})
export class PosReverseRelations implements ResourceAware {
  @State() data: Relation[] = [];

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.data = resource.reverseRelations();
  };

  render() {
    const items = this.data.map(it => (
      <ion-item-group>
        <ion-item-divider>
          <pos-predicate uri={it.predicate} label={`is ${it.label} of`} />
        </ion-item-divider>
        {it.uris.map(uri => (
          <pos-rich-link uri={uri} />
        ))}
      </ion-item-group>
    ));
    return this.data.length > 0 ? <ion-list>{items}</ion-list> : null;
  }
}
