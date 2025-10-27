import { PodOS } from '@pod-os/core';

export function usePodOS(el: HTMLElement): Promise<PodOS> {
  return new Promise(resolve => {
    el.dispatchEvent(
      new CustomEvent('pod-os:init', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: (os: PodOS) => {
          resolve(os);
        },
      }),
    );
  });
}
