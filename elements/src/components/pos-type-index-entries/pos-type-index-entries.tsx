import { Component, Element, h, Prop, State } from '@stencil/core';
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
    return this.entries.map(it => (
      <dl>
        <dt>
          {/*TODO short label*/}
          <pos-predicate uri={it.forClass} label={it.forClass}></pos-predicate>
        </dt>
        <dd>
          <pos-rich-link uri={it.targets[0].uri}></pos-rich-link>
        </dd>
      </dl>
    ));
  }
}
