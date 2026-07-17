import { Literal, RdfType, Relation, Thing } from '@pod-os/core';
import { Component, Element, Event, h, Host, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { Subject, takeUntil } from 'rxjs';
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
  @State() cases: CaseWithRule[] = [];
  @State() types: RdfType[] = [];
  @State() relations: Relation[] = [];
  @State() reverseRelations: Relation[] = [];
  @State() literals: Literal[] = [];

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
    if (this.containsRule('if-typeof')) {
      resource
        .observeTypes()
        .pipe(takeUntil(this.disconnected$))
        .subscribe(types => {
          this.types = types;
        });
    }
    if (this.containsRule('if-property')) {
      resource
        .observeRelations()
        .pipe(takeUntil(this.disconnected$))
        .subscribe(relations => {
          this.relations = relations;
        });
      resource
        .observeLiterals()
        .pipe(takeUntil(this.disconnected$))
        .subscribe(literals => {
          this.literals = literals;
        });
    }
    if (this.containsRule('if-rev')) {
      resource
        .observeReverseRelations()
        .pipe(takeUntil(this.disconnected$))
        .subscribe(reverseRelations => {
          this.reverseRelations = reverseRelations;
        });
    }
  };

  private containsRule(type: SwitchCaseRule['type']) {
    return this.cases.some(it => it.rule.type === type);
  }

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
