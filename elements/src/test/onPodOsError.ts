import { Mock, vi } from 'vitest';

export function onPodOsError(el: HTMLElement): Mock {
  const handler = vi.fn();
  el.addEventListener('pod-os:error', handler);
  return handler;
}
