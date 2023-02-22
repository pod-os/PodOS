import { PodOS } from '@pod-os/core';
import { EventEmitter } from '@stencil/core';

export type PodOsReceiver = (os: PodOS) => void;
export type PodOsEventEmitter = EventEmitter<PodOsReceiver>;

export interface PodOsAware {
  subscribePodOs: PodOsEventEmitter;
  receivePodOs: PodOsReceiver;
}

export function subscribePodOs(component: PodOsAware) {
  component.subscribePodOs.emit(component.receivePodOs);
}
