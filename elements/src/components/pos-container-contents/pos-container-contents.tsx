import { Thing, ContainerContent, LdpContainer } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-container-contents',
  shadow: true,
  styleUrl: 'pos-container-contents.css',
})
export class PosContainerContents implements ResourceAware {
  @State() contents: ContainerContent[] = [];

  @State() loading = true;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    const doc = resource.assume(LdpContainer);
    this.loading = false;
    this.contents = doc.contains().sort((a, b) => a.name.localeCompare(b.name));
  };

  render() {
    if (this.loading) return null;
    const items = this.contents.map(it => (
      <li>
        <pos-resource lazy={true} uri={it.uri}>
          <pos-container-item>{it.name}</pos-container-item>
        </pos-resource>
      </li>
    ));
    return this.contents.length > 0 ? (
      <Host>
        <pos-container-toolbar></pos-container-toolbar>
        <ul>{items}</ul>
      </Host>
    ) : (
      <p>The container is empty</p>
    );
  }
}
