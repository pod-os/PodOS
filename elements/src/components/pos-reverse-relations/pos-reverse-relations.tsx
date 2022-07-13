import { Component, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pos-reverse-relations',
  shadow: true,
})
export class PosReverseRelations {
  @State() data: any[] = [];

  @Event({ eventName: 'pod-os:resource' }) getResource: EventEmitter;

  componentWillLoad() {
    this.getResource.emit(this.setResource);
  }

  setResource = async (resource: any) => {
    this.data = resource.reverseRelations();
  };

  render() {
    const items = this.data.map(it => (
      <ion-item-group>
        <ion-item-divider>
          <ion-label>is {it.predicate} of</ion-label>
        </ion-item-divider>
        {it.uris.map(uri => (
          <pos-rich-link uri={uri} />
        ))}
      </ion-item-group>
    ));
    return this.data.length > 0 ? <ion-list>{items}</ion-list> : null;
  }
}
