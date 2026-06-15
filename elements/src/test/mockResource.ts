import { Thing } from '@pod-os/core';

export function mockResource(resource: Thing) {
  document.addEventListener('pod-os:resource', (event: any) => {
    event.detail(resource);
  });
}
