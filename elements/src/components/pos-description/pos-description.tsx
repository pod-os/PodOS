import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { Subject, takeUntil } from 'rxjs';

/**
 * Displays a description of the resource, as provided by [Thing.description()](https://pod-os.org/reference/core/classes/thing/#description).
 *
 * Re-renders when data in the store changes using [Thing.observeDescription()](https://pod-os.org/reference/core/classes/thing/#observeDescription).
 */
@Component({
  tag: 'pos-description',
  shadow: true,
})
export class PosDescription implements ResourceAware {
  @State() description: string;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  private readonly disconnected$ = new Subject<void>();

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    resource
      .observeDescription()
      .pipe(takeUntil(this.disconnected$))
      .subscribe(description => (this.description = description));
  };

  render() {
    return this.description ? this.description : null;
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.unsubscribe();
  }
}
