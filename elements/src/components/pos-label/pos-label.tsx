import { Thing } from '@pod-os/core';
import { Component, Event, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { Subject, takeUntil } from 'rxjs';

/**
 * Displays a human-readable label of the resource, as provided by [Thing.label()](https://pod-os.org/reference/core/classes/thing/#label).
 * 
 * Re-renders when data in the store changes using [Thing.observeLabel()](https://pod-os.org/reference/core/classes/thing/#observeLabel).
 */
@Component({
  tag: 'pos-label',
  shadow: true,
})
export class PosLabel implements ResourceAware {
  @State() label: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  private readonly disconnected$ = new Subject<void>();

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    resource
      .observeLabel()
      .pipe(takeUntil(this.disconnected$))
      .subscribe(label => (this.label = label));
  };

  render() {
    return this.label ? this.label : null;
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.unsubscribe();
  }
}
