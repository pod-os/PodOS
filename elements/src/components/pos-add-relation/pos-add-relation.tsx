import { Component, h, Host, Element, State, Event, EventEmitter } from '@stencil/core';
import { useResource } from '../events/useResource';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { labelFromUri, PodOS, Relation, Thing } from '@pod-os/core';
import { usePodOS } from '../events/usePodOS';

/**
 * Add a new relation from the current resource to another one
 */
@Component({
  tag: 'pos-add-relation',
  styleUrl: 'pos-add-relation.css',
  shadow: true,
})
export class PosAddRelation {
  @Element()
  el: HTMLElement;

  @State()
  os: PodOS;

  @State()
  resource: Thing;

  @State()
  selectedTermUri: string;

  @State() currentValue: string;

  /**
   * The relation has been added to the resource and successfully stored to the Pod.
   */
  @Event({ eventName: 'pod-os:added-relation' }) addedRelation: EventEmitter<Relation>;

  /**
   * Something went wrong while adding the relation.
   */
  @Event({ eventName: 'pod-os:error' }) error: EventEmitter;

  private valueInput: HTMLInputElement;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
    this.resource = await useResource(this.el);
  }

  onTermSelected(event: CustomEvent<{ uri: string }>) {
    this.valueInput.focus();
    this.selectedTermUri = event.detail.uri;
  }

  async save() {
    try {
      await this.os.addRelation(this.resource, this.selectedTermUri, this.currentValue);
      const relation = {
        predicate: this.selectedTermUri,
        label: labelFromUri(this.selectedTermUri),
        uris: [this.currentValue],
      };
      this.addedRelation.emit(relation);
      this.currentValue = '';
    } catch (e) {
      this.error.emit(e);
    }
  }

  render() {
    if (!this.resource.editable) {
      return;
    }
    return (
      <Host>
        <sl-icon name="plus-circle"></sl-icon>
        <pos-select-term placeholder="Add relation" onPod-os:term-selected={ev => this.onTermSelected(ev)} />
        <input
          ref={el => (this.valueInput = el)}
          type="url"
          aria-label="URI"
          placeholder=""
          value={this.currentValue}
          onInput={ev => (this.currentValue = (ev.target as HTMLInputElement).value)}
          onChange={() => this.save()}
        ></input>
      </Host>
    );
  }
}
