import { Literal, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-literals',
  shadow: true,
})
export class PosLiterals implements ResourceAware {
  @State() data: Literal[] = [];

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.data = resource.literals();
  };

  render() {
    const items = this.data.map(it => (
      <ion-item-group>
        <ion-item-divider>
          <ion-label>{it.predicate}</ion-label>
        </ion-item-divider>
        {it.values.map(value => (
          <ion-item>
            <ion-label class="ion-text-wrap">{value}</ion-label>{' '}
          </ion-item>
        ))}
      </ion-item-group>
    ));
    return (
      <Host>
        {this.data.length > 0 ? <ion-list>{items}</ion-list> : null}
        <pos-add-literal-value />
      </Host>
    );
  }
}
