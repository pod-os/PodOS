import { RdfType, Relation, Thing } from '@pod-os/core';
import { Component, Element, Event, h, Host, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { combineLatest, firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';

/**
 * Selects a child template to render based on properties of the subject resource, usually defined by an ancestor `pos-resource` element.
 * See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-switch) for an example.
 * See [pos-case](https://pod-os.org/reference/elements/components/pos-switch/pos-case/) for available filter conditions.
 */
@Component({
  tag: 'pos-switch',
  shadow: false,
})
export class PosSwitch implements ResourceAware {
  @Element() host: HTMLElement;
  @State() error: string = null;
  @State() resource: Thing;
  @State() caseElements: HTMLPosCaseElement[];
  @State() types: RdfType[];
  @State() relations: Relation[];
  @State() reverseRelations: Relation[];

  private readonly disconnected$ = new Subject<void>();

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    const caseElements = this.host.querySelectorAll('pos-case');
    if (caseElements.length == 0) {
      this.error = 'No pos-case elements found';
    } else {
      this.caseElements = Array.from(caseElements);
      subscribeResource(this);
    }
  }

  test(caseElement): boolean {
    let state = null;
    if (caseElement.getAttribute('if-typeof') !== null) {
      state = this.types.map(x => x.uri).includes(caseElement.getAttribute('if-typeof'));
    }
    if (caseElement.getAttribute('if-property') !== null) {
      state = this.relations.map(x => x.predicate).includes(caseElement.getAttribute('if-property'));
    }
    if (caseElement.getAttribute('if-rev') !== null) {
      state = this.reverseRelations.map(x => x.predicate).includes(caseElement.getAttribute('if-rev'));
    }
    if (caseElement.getAttribute('not') != null) {
      state = !state;
    }
    return state;
  }

  receiveResource = async (resource: Thing) => {
    let observables: Observable<any>[] = [];
    if (this.caseElements.some(caseElement => caseElement.hasAttribute('if-typeof'))) {
      const observeTypes = resource.observeTypes().pipe(takeUntil(this.disconnected$));
      observeTypes.subscribe(types => {
        this.types = types;
      });
      observables.push(observeTypes);
    }
    if (this.caseElements.some(caseElement => caseElement.hasAttribute('if-property'))) {
      const observeRelations = resource.observeRelations().pipe(takeUntil(this.disconnected$));
      observeRelations.subscribe(relations => {
        this.relations = relations;
      });
      observables.push(observeRelations);
    }
    if (this.caseElements.some(caseElement => caseElement.hasAttribute('if-rev'))) {
      const observeReverseRelations = resource.observeReverseRelations().pipe(takeUntil(this.disconnected$));
      observeReverseRelations.subscribe(reverseRelations => {
        this.reverseRelations = reverseRelations;
      });
      observables.push(observeReverseRelations);
    }
    await firstValueFrom(combineLatest(observables));
    this.resource = resource;
  };

  render() {
    if (this.error) {
      return this.error;
    }
    if (!this.resource) {
      return null;
    }
    let state = null;
    let activeElements: HTMLPosCaseElement[] = [];
    this.caseElements.forEach(el => {
      const elemState = this.test(el);
      const includeCondition = state !== true || el.getAttribute('else') === null;
      if (elemState && includeCondition) {
        state = elemState;
        activeElements.push(el);
      }
      if (elemState === null && includeCondition) {
        activeElements.push(el);
      }
    });
    const activeElementsContent = activeElements.map(el => el.querySelector('template').innerHTML).join('\n');
    return <Host innerHTML={activeElementsContent}></Host>;
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.unsubscribe();
  }
}
