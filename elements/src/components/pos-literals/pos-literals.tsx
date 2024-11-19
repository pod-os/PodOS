import { Literal, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-literals',
  styleUrl: './pos-literals.css',
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

  literalValueAdded(newLiteral: Literal) {
    const existing = this.data.find(it => it.predicate === newLiteral.predicate);

    if (!existing) {
      this.data = [...this.data, newLiteral];
    } else {
      this.data = this.data.map(it => {
        return it.predicate === existing.predicate
          ? {
              predicate: existing.predicate,
              label: existing.label,
              values: [...existing.values, ...newLiteral.values],
            }
          : it;
      });
    }
  }

  render() {
    return (
      <Host>
        {this.data.length > 0 ? (
          <dl>
            {this.data.map(it => (
              <div>
                <dt>
                  <pos-predicate uri={it.predicate} label={it.label} />
                </dt>
                {it.values.map(value => (
                  <dd>{value}</dd>
                ))}
              </div>
            ))}
          </dl>
        ) : null}
        <pos-add-literal-value onPod-os:added-literal-value={event => this.literalValueAdded(event.detail)} />
      </Host>
    );
  }
}
