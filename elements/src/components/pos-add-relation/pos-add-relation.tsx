import { Component, h, Host, Element, State } from '@stencil/core';
import { useResource } from '../events/useResource';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { PodOS, Thing } from '@pod-os/core';
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

  private valueInput: HTMLInputElement;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
    this.resource = await useResource(this.el);
  }

  onTermSelected(event: CustomEvent<{ uri: string }>) {
    this.valueInput.focus();
    this.selectedTermUri = event.detail.uri;
  }

  async save(event) {
    await this.os.addRelation(this.resource, this.selectedTermUri, event.target.value);
    this.currentValue = '';
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
          value={this.currentValue}
          type="url"
          aria-label="URI"
          placeholder=""
          onChange={ev => this.save(ev)}
        ></input>
      </Host>
    );
  }
}
