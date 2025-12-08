import { Component, Element, h, Prop, State } from '@stencil/core';
import { usePodOS } from '../events/usePodOS';
import { TypeIndex, TypeRegistration } from '@pod-os/core';

@Component({
  tag: 'pos-type-index-entries',
  shadow: true,
  styleUrl: 'pos-type-index-entries.css',
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
    if (this.entries.length === 0) return null;
    const entries = this.entries.map(it => (
      <div>
        <dt>
          <pos-predicate uri={it.forClass} label={it.label}></pos-predicate>
        </dt>
        {it.targets.map(target => (
          <dd>
            <pos-rich-link uri={target.uri}></pos-rich-link>
          </dd>
        ))}
      </div>
    ));
    return <dl>{entries}</dl>;
  }
}
