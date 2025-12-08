import { Thing } from '@pod-os/core';

export function useResource(el: HTMLElement): Promise<Thing> {
  return new Promise(resolve => {
    el.dispatchEvent(
      new CustomEvent('pod-os:resource', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: (thing: Thing) => {
          resolve(thing);
        },
      }),
    );
  });
}
