import { Thing, ContainerContent, LdpContainer } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-container-contents',
  shadow: true,
})
export class PosContainerContents implements ResourceAware {
  @State() contents: ContainerContent[] = [];

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    const doc = resource.assume(LdpContainer);
    this.contents = doc.contains();
  };

  render() {
    const items = this.contents.map(it => (
      <pos-resource lazy={true} uri={it.uri}>
        <ion-item
          href={it.uri}
          onClick={e => {
            e.preventDefault();
            this.linkEmitter.emit(it.uri);
          }}
        >
          <ion-label>
            {it.name}
            <p>{it.uri}</p>
          </ion-label>
        </ion-item>
      </pos-resource>
    ));
    return this.contents.length > 0 ? <ion-list>{items}</ion-list> : null;
  }
}
