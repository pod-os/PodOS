import { Literal, PodOS, Thing } from '@pod-os/core';
import { Component, Element, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { usePodOS } from '../events/usePodOS';
import { EditableLiteral, EditableValue, LiteralChanged, processEdits } from './processEdits';
import { Subject } from 'rxjs';

@Component({
  tag: 'pos-literals',
  styleUrl: './pos-literals.css',
  shadow: true,
})
export class PosLiterals implements ResourceAware {
  @State() data: EditableLiteral[] = [];

  @State() editable: boolean = false;

  @State() resource!: Thing;
  @State() os!: PodOS;

  @Element() el!: HTMLElement;

  private readonly edits: Subject<LiteralChanged> = new Subject<LiteralChanged>();

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource!: EventEmitter;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
    this.edits.pipe(processEdits(this.os)).subscribe(); // no need to unsubscribe since the stream source dies with the component
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
    this.data = resource.literals().map(it => makeEditable(resource, it));
    this.editable = resource.editable;
  };

  literalValueAdded(newLiteral: Literal) {
    const existing = this.data.find(it => it.predicate === newLiteral.predicate);

    if (!existing) {
      this.data = [...this.data, makeEditable(this.resource, newLiteral)];
    } else {
      this.data = this.data.map(it => {
        return it.predicate === existing.predicate
          ? {
              resource: existing.resource,
              predicate: existing.predicate,
              label: existing.label,
              values: [...existing.values, ...newLiteral.values.map(makeEditableValue)],
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
                  {it.values.map(field => (
                    <dd key={field.fieldId}>
                      <div
                        role={this.editable ? 'textbox' : undefined}
                        contentEditable={this.editable ? 'plaintext-only' : 'false'}
                        onInput={ev =>
                          this.edits.next({
                            resource: this.resource,
                            predicate: it.predicate,
                            oldValue: field.value,
                            newValue: (ev.target as HTMLElement).textContent,
                          })
                        }
                      >
                        {field.value}
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

function makeEditable(resource: Thing, literal: Literal): EditableLiteral {
  return {
    resource,
    predicate: literal.predicate,
    label: literal.label,
    values: literal.values.map(it => makeEditableValue(it)),
  };
}

function makeEditableValue(value: string): EditableValue {
  return {
    fieldId: crypto.randomUUID(),
    value: value,
  };
}
