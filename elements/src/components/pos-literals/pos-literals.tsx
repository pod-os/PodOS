import { Literal, PodOS, Thing } from '@pod-os/core';
import { Component, Element, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { Subject } from 'rxjs';
import { usePodOS } from '../events/usePodOS';
import { LiteralChanged, processEdits } from './processEdits';

@Component({
  tag: 'pos-literals',
  styleUrl: './pos-literals.css',
  shadow: true,
})
export class PosLiterals implements ResourceAware {
  @State() data: Literal[] = [];

  @State() editable: boolean = false;

  @State() resource!: Thing;
  @State() os!: PodOS;

  @Element() el!: HTMLElement;

  private edits: Subject<LiteralChanged> = new Subject<LiteralChanged>();

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource!: EventEmitter;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
    this.edits.pipe(processEdits(this.os, this.resource)).subscribe();
    // TODO: unsubscribe
    this.data = resource.literals();
    this.editable = resource.editable;
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
              <div class="predicate-values" key={it.predicate}>
                <dt>
                  <pos-predicate uri={it.predicate} label={it.label} />
                </dt>
                <div class="values">
                  {it.values.map(value => (
                    <dd key={value}>
                      <div
                        role={this.editable ? 'textbox' : undefined}
                        contentEditable={this.editable ? 'plaintext-only' : 'false'}
                        onInput={ev =>
                          this.edits.next({
                            predicate: it.predicate,
                            oldValue: value,
                            newValue: (ev.target as HTMLElement).textContent,
                          })
                        }
                      >
                        {value}
                      </div>
                    </dd>
                  ))}
                </div>
              </div>
            ))}
          </dl>
        ) : null}
        <pos-add-literal-value onPod-os:added-literal-value={event => this.literalValueAdded(event.detail)} />
      </Host>
    );
  }
}
