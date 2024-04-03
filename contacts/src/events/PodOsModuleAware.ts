import { EventEmitter } from '@stencil/core';

export type PodOsModuleReceiver<T> = (module: T) => void;
interface PodOsModuleEvent<T> {
  module: string;
  receiver: PodOsModuleReceiver<T>;
}
export type PodOsModuleEventEmitter<T> = EventEmitter<PodOsModuleEvent<T>>;

export interface PodOsModuleAware<T> {
  componentWillLoad(): void | Promise<void>;
  subscribeModule: PodOsModuleEventEmitter<T>;
  receiveModule: PodOsModuleReceiver<T>;
}

export function subscribePodOsModule<T>(module: string, component: PodOsModuleAware<T>) {
  component.subscribeModule.emit({ module, receiver: component.receiveModule });
}
