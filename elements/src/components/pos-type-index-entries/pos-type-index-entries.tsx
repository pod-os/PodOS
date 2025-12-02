import { Component, Element, Prop, State, Host, h } from '@stencil/core';
import { usePodOS } from '../events/usePodOS';
import { TypeIndex, TypeRegistration } from '@pod-os/core';

@Component({
  tag: 'pos-type-index-entries',
})
export class PosTypeIndexEntries {
  @Prop() uri: string;

  @Element()
  el!: HTMLElement;

  @State()
  entries!: TypeRegistration[];

  async componentWillLoad() {
    const os = await usePodOS(this.el);
    os.store.get(this.uri);
    const typeIndex = os.store.get(this.uri).assume(TypeIndex);
    this.entries = typeIndex.listAll();
  }

  render() {
    return <Host></Host>;
  }
}
