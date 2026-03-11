import { Relation, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';
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

  relationAdded(newRelation: Relation) {
    const existing = this.data.find(it => it.predicate === newRelation.predicate);

    if (!existing) {
      this.data = [...this.data, newRelation];
    } else {
      this.data = this.data.map(it => {
        return it.predicate === existing.predicate
          ? {
              predicate: existing.predicate,
              label: existing.label,
              uris: [...existing.uris, ...newRelation.uris],
            }
          : it;
      });
    }
  }

  render() {
    const items = this.data.map(it => (
      <div class="predicate-values">
        <dt>
          <pos-predicate uri={it.predicate} label={it.label} />
        </dt>
        <div class="values">
          {it.uris.map(uri => (
            <dd>
              <pos-rich-link uri={uri} />
            </dd>
          ))}
        </div>
      </div>
    ));
    return (
      <Host>
        {this.data.length > 0 ? <dl>{items}</dl> : null}
        <pos-add-relation onPod-os:added-relation={ev => this.relationAdded(ev.detail)}></pos-add-relation>
      </Host>
    );
  }
}
