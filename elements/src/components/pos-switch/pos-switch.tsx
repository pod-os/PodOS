import { Literal, RdfType, Relation, Thing } from '@pod-os/core';
import { Component, Element, Event, h, Host, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { combineLatest, firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { operatorSemanticCombinations, testIfValuesMatchTarget } from './logic';
import { SwitchCaseRule } from './rules';

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
  @Element() host: HTMLElement;
  @State() error: string = null;
  @State() resource: Thing;
  @State() caseElements: HTMLPosCaseElement[];
  @State() cases: CaseWithRule[];
  @State() types: RdfType[];
  @State() relations: Relation[];
  @State() reverseRelations: Relation[];
  @State() literals: Literal[];

  private readonly disconnected$ = new Subject<void>();

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

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

  test(caseElement: HTMLPosCaseElement): boolean {
    let state: boolean | null = null;
    let values = null;

    const compareValues = function (values: string[]): boolean {
      let state = true;
      operatorSemanticCombinations.forEach(({ semantic, operator }) => {
        const attr = `${semantic}-value-${operator}`;
        if (caseElement.hasAttribute(attr)) {
          const targetValue = caseElement.getAttribute(attr)!;
          state = state && testIfValuesMatchTarget(values, semantic, operator, targetValue);
        }
      });
      return state;
    };

    if (caseElement.getAttribute('if-typeof') !== null) {
      state = this.types.map(x => x.uri).includes(caseElement.getAttribute('if-typeof'));
    }
    if (caseElement.getAttribute('if-property') !== null) {
      const matchingRelations = this.relations.filter(x => x.predicate == caseElement.getAttribute('if-property'));
      const matchingLiterals = this.literals.filter(x => x.predicate == caseElement.getAttribute('if-property'));
      values = [];
      if (matchingRelations.length > 0) {
        values.push(...matchingRelations[0].uris);
      }
      if (matchingLiterals.length > 0) {
        values.push(...matchingLiterals[0].values);
      }
      state = matchingRelations.length > 0 || matchingLiterals.length > 0;
    }
    if (caseElement.getAttribute('if-rev') !== null) {
      const matchingRelations = this.reverseRelations.filter(x => x.predicate == caseElement.getAttribute('if-rev'));
      if (matchingRelations.length > 0) {
        values = matchingRelations[0].uris;
      }
      state = matchingRelations.length > 0;
    }
    if (values) {
      state = state && compareValues(values);
    }
    if (caseElement.getAttribute('not') != null) {
      state = !state;
    }
    return state ?? true;
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
      return null;
    }
    let state: boolean | null = null;
    let activeElements: HTMLPosCaseElement[] = [];

    this.cases.forEach(it => {
      const caseState = this.testRule(it.rule);
      if (caseState) {
        activeElements.push(it.caseElement);
      }
    });

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
    this.disconnected$.complete();
  }

  private testRule(_: SwitchCaseRule) {
    return false;
  }
}
