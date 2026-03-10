import { Component, h, Host, Element, State } from '@stencil/core';
import { useResource } from '../events/useResource';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { Thing } from '@pod-os/core';

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
  resource: Thing;

  private valueInput: HTMLInputElement;

  async componentWillLoad() {
    this.resource = await useResource(this.el);
  }

  onTermSelected(_event: CustomEvent<{ uri: string }>) {
    this.valueInput.focus();
  }

  render() {
    if (!this.resource.editable) {
      return;
    }
    return (
      <Host>
        <sl-icon name="plus-circle"></sl-icon>
        <pos-select-term placeholder="Add relation" onPod-os:term-selected={ev => this.onTermSelected(ev)} />
        <input ref={el => (this.valueInput = el)} type="url" aria-label="URI" placeholder=""></input>
      </Host>
    );
  }
}
