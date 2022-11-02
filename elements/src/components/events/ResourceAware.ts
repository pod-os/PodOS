import { EventEmitter } from '@stencil/core';

export type ResourceReceiver = (Thing) => void;
export type ResourceEventEmitter = EventEmitter<ResourceReceiver>;

export interface ResourceAware {
  subscribeResource: ResourceEventEmitter;
  receiveResource: ResourceReceiver;
}

export function subscribeResource(component: ResourceAware) {
  component.subscribeResource.emit(component.receiveResource);
}
