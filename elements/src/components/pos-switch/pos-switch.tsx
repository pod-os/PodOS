import { Thing } from '@pod-os/core';
import { Component, Element, Event, h, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { combineLatest, map, of, Subject, takeUntil } from 'rxjs';
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
  shadow: true,
})
export class PosSwitch implements ResourceAware {
  @Element() host!: HTMLElement;
  @State() error: string | null = null;
  @State() resource?: Thing;
  @State() cases: CaseWithRule[] = [];

  private readonly disconnected$ = new Subject<void>();

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource!: ResourceEventEmitter;

  componentWillLoad() {
    const caseElements = Array.from(this.host.querySelectorAll('pos-case'));
    if (caseElements.length == 0) {
      this.error = 'No pos-case elements found';
      return;
    }
    // Do NOT await: awaiting a child @Method in componentWillLoad deadlocks the
    // lazy load graph (the child can't render until this component renders).
    // Build the rules once the children have upgraded, then subscribe to the resource
    Promise.all(
      caseElements.map(async it => ({
        rule: await it.getRule(),
        caseElement: it,
      })),
    ).then(cases => {
      this.cases = cases;
      subscribeResource(this);
    });
  }

  receiveResource = (resource: Thing) => {
    // reset any existing resource
    this.disconnected$.next();
    this.resource = resource;

    combineLatest([
      this.containsRule('if-typeof') ? resource.observeTypes() : of([]),
      this.containsRule('if-property') ? resource.observeLiterals() : of([]),
      this.containsRule('if-property') ? resource.observeRelations() : of([]),
      this.containsRule('if-rev') ? resource.observeReverseRelations() : of([]),
    ])
      .pipe(
        map(([types, literals, relations, reverseRelations]) => ({
          types,
          literals,
          relations,
          reverseRelations,
        })),
        takeUntil(this.disconnected$),
      )
      .subscribe((context: RuleContext) => {
        const activeElements = new Set(findMatchingRules(this.cases, context).map(it => it.caseElement));
        this.cases.forEach(it => {
          if (activeElements.has(it.caseElement)) {
            it.caseElement.setAttribute('active', '');
          } else {
            it.caseElement.removeAttribute('active');
          }
        });
      });
  };

  private containsRule(type: SwitchCaseRule['type']) {
    return this.cases.some(it => it.rule.type === type);
  }

  render() {
    if (this.error) {
      return this.error;
    }
    if (!this.resource) {
      return null;
    }

    return <slot></slot>;
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.complete();
  }
}
