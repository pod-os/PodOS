import { Component, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pos-relations',
  shadow: true,
})
export class PosRelations {
  @State() data: any[] = [];

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: any) => {
    this.data = resource.relations();
  };

  render() {
    const items = this.data.map(it => (
      <ion-item-group>
        <ion-item-divider>
          <ion-label>{it.predicate}</ion-label>
        </ion-item-divider>
        {it.uris.map(value => (
          <ion-item>
            <ion-label class="ion-text-wrap">{value}</ion-label>{' '}
          </ion-item>
        ))}
      </ion-item-group>
    ));
    return this.data.length > 0 ? <ion-list>{items}</ion-list> : null;
  }
}
