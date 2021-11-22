import { Component, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pos-literals',
  shadow: true,
})
export class PosLiterals {
  @State() data: any[] = [];

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: any) => {
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
    return this.data.length > 0 ? <ion-list>{items}</ion-list> : null;
  }
}
