import { vi } from 'vitest';

export function onPodOsError(el: HTMLElement) {
  const handler = vi.fn();
  el.addEventListener('pod-os:error', handler);
  return handler;
}
