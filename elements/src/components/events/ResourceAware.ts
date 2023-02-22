import {Thing} from "@pod-os/core";
import { EventEmitter } from '@stencil/core';

export type ResourceReceiver = (resource: Thing) => void;
export type ResourceEventEmitter = EventEmitter<ResourceReceiver>;

export interface ResourceAware {
  subscribeResource: ResourceEventEmitter;
  receiveResource: ResourceReceiver;
}

export function subscribeResource(component: ResourceAware) {
  component.subscribeResource.emit(component.receiveResource);
}
