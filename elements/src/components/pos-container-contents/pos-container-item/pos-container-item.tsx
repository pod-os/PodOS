import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../../events/ResourceAware';
import { selectIconForTypes } from '../selectIconForTypes';

@Component({
  tag: 'pos-container-item',
  shadow: true,
  styleUrl: 'pos-container-item.css',
})
export class PosContainerItem implements ResourceAware {
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    if (!this.resource) return null;
    const iconName = selectIconForTypes(this.resource.types());
    return (
      <a
        href={this.resource.uri}
        onClick={e => {
          e.preventDefault();
          this.linkEmitter.emit(this.resource.uri);
        }}
      >
        <ion-icon name={iconName} slot="start"></ion-icon>
        <slot></slot>
      </a>
    );
  }
}
