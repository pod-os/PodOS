import { RdfDocument, Subject, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-subjects',
  shadow: true,
  styleUrl: 'pos-subjects.css',
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
    const items = this.data.map(it => (
      <li>
        <pos-rich-link uri={it.uri} />
      </li>
    ));
    return this.data.length > 0 ? <ul>{items}</ul> : null;
  }
}
