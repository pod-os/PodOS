import { Relation, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-relations',
  shadow: true,
  styleUrl: 'pos-relations.css',
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
      <div class="predicate-values">
        <dt>
          <pos-predicate uri={it.predicate} label={it.label} />
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
