import { Relation, Thing } from '@pod-os/core';
import { Component, h, Event, EventEmitter, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-reverse-relations',
  shadow: true,
  styleUrl: 'pos-reverse-relations.css',
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
      <div class="predicate-values">
        <dt>
          <pos-predicate uri={it.predicate} label={`is ${it.label} of`} />
        </dt>
        {it.uris.map(uri => (
          <dd>
            <pos-rich-link uri={uri} />
          </dd>
        ))}
      </div>
    ));
    return this.data.length > 0 ? <dl>{items}</dl> : null;
  }
}
