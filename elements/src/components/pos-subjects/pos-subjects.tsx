import { RdfDocument, Subject, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-subjects',
  shadow: true,
})
export class PosSubjects implements ResourceAware {
  @State() data: Subject[] = [];

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    const doc = resource.assume(RdfDocument);
    this.data = doc.subjects();
  };

  render() {
    const items = this.data.map(it => <pos-rich-link uri={it.uri} />);
    return this.data.length > 0 ? <ion-list>{items}</ion-list> : null;
  }
}
