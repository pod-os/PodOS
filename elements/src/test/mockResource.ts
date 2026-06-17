import { Thing } from '@pod-os/core';
import { Subject, tap } from 'rxjs';

/**
 * Respond with the given resource to a pod-os:resource event
 *
 * This will only provide one resource, once. If you need to change the resource over time,
 * use mockResources() instead.
 *
 * @param resource The resource to receive in the requesting component
 */
export function mockResource(resource: Partial<Thing>) {
  document.addEventListener(
    'pod-os:resource',
    (event: any) => {
      event.detail(resource);
    },
    { once: true }, // only once to prevent test pollution
  );
}

/**
 * Provide resources to components that requested a resource
 * via pod-os:resource event.
 * @returns A subject that can be used to emit resources, that will be received by the requesting component.
 */
export function mockResources() {
  const subject = new Subject<Partial<Thing>>();
  document.addEventListener(
    'pod-os:resource',
    (event: any) => {
      subject
        .pipe(
          tap(resource => {
            event.detail(resource);
          }),
        )
        .subscribe();
    },
    { once: true }, // only once to prevent test pollution
  );
  return subject;
}
