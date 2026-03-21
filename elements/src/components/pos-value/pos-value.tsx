import { Thing } from '@pod-os/core';
import { Component, Event, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { Subject, takeUntil } from 'rxjs';

/**
 * Shows a single value linked to the resource using the given predicate.
 * The value is determined by [Thing.observeAnyValue()](https://pod-os.org/reference/core/classes/thing/#observeanyvalue)
 * and re-renders when data in the store changes
 */
@Component({
  tag: 'pos-value',
  shadow: true,
})
export class PosValue implements ResourceAware {
  /**
   * URI of the predicate to get the value from
   */
  @Prop() predicate: string;
  @State() value: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  private readonly disconnected$ = new Subject<void>();

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    resource
      .observeAnyValue(this.predicate)
      .pipe(takeUntil(this.disconnected$))
      .subscribe(value => (this.value = value));
  };

  render() {
    return this.value ?? null;
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.complete();
  }
}
