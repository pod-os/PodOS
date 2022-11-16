import { RdfType, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-type-badges',
  shadow: true,
  styleUrl: 'pos-type-badges.css',
})
export class PosTypeBadges implements ResourceAware {
  @State() data: RdfType[] = [];

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.data = resource.types();
  };

  render() {
    return (
      <div class="types">
        {this.data.map(it => (
          <ion-badge>{it.label}</ion-badge>
        ))}
      </div>
    );
  }
}
