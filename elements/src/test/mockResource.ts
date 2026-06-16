import { Thing } from '@pod-os/core';

export function mockResource(resource: Partial<Thing>) {
  document.addEventListener('pod-os:resource', (event: any) => {
    event.detail(resource);
  });
}
