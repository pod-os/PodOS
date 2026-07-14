import { Literal, RdfType, Relation, Thing } from '@pod-os/core';
import { Component, Element, Event, h, Host, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { combineLatest, firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { findMatchingRules, RuleContext, SwitchCaseRule } from './rules';

interface CaseWithRule {
  caseElement: HTMLPosCaseElement;
  rule: SwitchCaseRule;
}

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
  @Element() host!: HTMLElement;
  @State() error: string | null = null;
  @State() resource?: Thing;
  @State() caseElements: HTMLPosCaseElement[] = [];
  @State() cases: CaseWithRule[] = [];
  @State() types: RdfType[] = [];
  @State() relations: Relation[] = [];
  @State() reverseRelations: Relation[] = [];
  @State() literals: Literal[] = [];

  private readonly disconnected$ = new Subject<void>();

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource!: ResourceEventEmitter;

  async componentWillLoad() {
    const caseElements = this.host.querySelectorAll('pos-case');
    if (caseElements.length == 0) {
      this.error = 'No pos-case elements found';
    } else {
      this.caseElements = Array.from(caseElements);
      this.cases = await Promise.all(
        this.caseElements.map(async it => ({
          rule: await it.getRule(),
          caseElement: it,
        })),
      );
      subscribeResource(this);
    }
  }

  receiveResource = (resource: Thing) => {
    // reset any existing resource
    this.disconnected$.next();
    this.resource = undefined;
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
      const observeLiterals = resource.observeLiterals().pipe(takeUntil(this.disconnected$));
      observeLiterals.subscribe(literals => {
        this.literals = literals;
      });
      observables.push(observeLiterals);
    }
    if (this.caseElements.some(caseElement => caseElement.hasAttribute('if-rev'))) {
      const observeReverseRelations = resource.observeReverseRelations().pipe(takeUntil(this.disconnected$));
      observeReverseRelations.subscribe(reverseRelations => {
        this.reverseRelations = reverseRelations;
      });
      observables.push(observeReverseRelations);
    }
    firstValueFrom(combineLatest(observables)).then(() => (this.resource = resource));
  };

  render() {
    if (this.error) {
      return this.error;
    }
    if (!this.resource) {
      // because we set innerHTML for matching case elements, we need to
      // unset it here to not leave "undefined" in the dom when switching
      // from one resource to another
      return <Host innerHTML=""></Host>;
    }
    let activeElements: HTMLPosCaseElement[] = [];

    const context: RuleContext = {
      literals: this.literals,
      relations: this.relations,
      reverseRelations: this.reverseRelations,
      types: this.types,
    };

    findMatchingRules(this.cases, context).forEach(it => {
      activeElements.push(it.caseElement);
    });

    const activeElementsContent = activeElements.map(el => el.querySelector('template')?.innerHTML).join('\n');
    return <Host innerHTML={activeElementsContent}></Host>;
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.complete();
  }
}
