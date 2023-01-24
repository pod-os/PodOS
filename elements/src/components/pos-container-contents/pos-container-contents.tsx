import { Thing, ContainerContent, LdpContainer } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-container-contents',
  shadow: true,
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
      <pos-resource lazy={true} uri={it.uri}>
        <pos-container-item role="listitem">
          <ion-label>
            <h3>{it.name}</h3>
            <p>{it.uri}</p>
          </ion-label>
        </pos-container-item>
      </pos-resource>
    ));
    return this.contents.length > 0 ? <ion-list>{items}</ion-list> : <p>The container is empty</p>;
  }
}
