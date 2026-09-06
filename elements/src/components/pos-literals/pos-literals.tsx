import { Literal, PodOS, Thing } from '@pod-os/core';
import { Component, Element, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { usePodOS } from '../events/usePodOS';
import { EditableLiteral, EditableValue, FieldState, LiteralEditor } from './LiteralEditor';

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

  @State() fieldStates: Record<string, FieldState> = {};

  @Element() el!: HTMLElement;

  editor!: LiteralEditor;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource!: EventEmitter;

  /**
   * Emitted when an error occurs during editing literals
   */
  @Event({ eventName: 'pod-os:error' }) errorEmitter!: EventEmitter<Error>;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
    this.data = resource.literals().map(it => makeEditable(resource, it));
    this.editable = resource.editable;
    this.editor = new LiteralEditor(this.os, this.data);
    this.editor.states$.subscribe(state => {
      this.fieldStates = {
        ...this.fieldStates,
        [state.fieldId]: state,
      };
      if (state.status === 'error') {
        this.errorEmitter.emit(new Error(state.message));
      }
    });
  };

  literalValueAdded(newLiteral: Literal) {
    const existing = this.data.find(it => it.predicate === newLiteral.predicate);

    const newEditableLiteral = makeEditable(this.resource, newLiteral);
    this.editor.registerFields(newEditableLiteral);

    if (!existing) {
      this.data = [...this.data, newEditableLiteral];
    } else {
      this.data = this.data.map(it => {
        return it.predicate === existing.predicate
          ? {
              resource: existing.resource,
              predicate: existing.predicate,
              label: existing.label,
              values: [...existing.values, newEditableLiteral.values[0]],
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
                        class={this.fieldStates[field.fieldId]?.status}
                        contentEditable={this.editable ? 'plaintext-only' : 'false'}
                        onInput={ev =>
                          this.editor.processEdit({
                            fieldId: field.fieldId,
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
