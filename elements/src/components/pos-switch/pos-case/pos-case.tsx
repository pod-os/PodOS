import { Component, Element, h, Host, Method, Prop, State } from '@stencil/core';
import { Comparison, ELSE_RULE, NEVER_RULE, Operator, Semantic, SwitchCaseRule } from '../rules';

/**
 * Defines a template to use if the specified condition is met - to be used with [pos-switch](https://pod-os.org/reference/elements/components/pos-switch/).
 * See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-switch) for an example.
 */
@Component({
  tag: 'pos-case',
  shadow: false,
  styleUrl: 'pos-case.css',
})
export class PosCase {
  @Element() host!: HTMLElement;
  @State() error: string | null = null;
  private templateHTML: string | null = null;

  /**
   * Test if the resource is of the specified type
   */
  @Prop() ifTypeof?: string;
  /**
   * Test if the resource has the specified property (forward link)
   */
  @Prop() ifProperty?: string;
  /**
   * Test if the resource is the subject of the specified property (backward link)
   */
  @Prop() ifRev?: string;
  /**
   * Negates the result of the test
   */
  @Prop() not?: boolean;
  /**
   * The test only evaluates to true if tests for preceding cases have failed
   */
  @Prop() else?: boolean;
  /**
   * Test if some value linked by if-property or if-rev is equal to the attribute
   */
  @Prop() someValueEq?: string;
  /**
   * Test if every value linked by if-property or if-rev is equal to the attribute
   */
  @Prop() everyValueEq?: string;
  /**
   * Test if some value linked by if-property or if-rev is strictly greater than the attribute. First a number comparison is attempted, then string.
   */
  @Prop() someValueGt?: string;
  /**
   * Test if every value linked by if-property or if-rev is strictly greater than the attribute. First a number comparison is attempted, then string.
   */
  @Prop() everyValueGt?: string;
  /**
   * Test if some value linked by if-property or if-rev is greater than or equal to the attribute. First a number comparison is attempted, then string.
   */
  @Prop() someValueGte?: string;
  /**
   * Test if every value linked by if-property or if-rev is greater than or equal to the attribute. First a number comparison is attempted, then string.
   */
  @Prop() everyValueGte?: string;
  /**
   * Test if some value linked by if-property or if-rev is strictly less than the attribute. First a number comparison is attempted, then string.
   */
  @Prop() someValueLt?: string;
  /**
   * Test if every value linked by if-property or if-rev is strictly less than the attribute. First a number comparison is attempted, then string.
   */
  @Prop() everyValueLt?: string;
  /**
   * Test if some value linked by if-property or if-rev is less than or equal to the attribute. First a number comparison is attempted, then string.
   */
  @Prop() someValueLte?: string;
  /**
   * Test if every value linked by if-property or if-rev is less than or equal to the attribute. First a number comparison is attempted, then string.
   */
  @Prop() everyValueLte?: string;

  componentWillRender() {
    const countRules = [this.ifTypeof, this.ifProperty, this.ifRev].filter(it => it !== undefined).length;
    if (countRules > 1) {
      this.error = 'At most 1 "if-" must be present';
    }
    const countComparisons = [
      this.someValueLt,
      this.everyValueLt,
      this.someValueLte,
      this.everyValueLte,
      this.someValueEq,
      this.everyValueEq,
      this.someValueGte,
      this.everyValueGte,
      this.someValueGt,
      this.everyValueGt,
    ].filter(it => it !== undefined).length;
    if (countComparisons > 1) {
      this.error = 'At most 1 comparison ("every-" / "some-") must be present';
    }
  }

  /**
   * Whether this case is active, i.e. shown. Usually this is controlled by the surrounding pos-switch, and there is no need to set this manually.
   */
  @Prop() active = false;

  /**
   * Returns the rule definition for this case. The rule determines if the element's content gets rendered.
   */
  @Method()
  async getRule(): Promise<SwitchCaseRule> {
    const modifiers = {
      not: this.not,
      else: this.else,
    };
    const comparison = this.getComparison();
    if (this.ifTypeof) {
      return {
        type: 'if-typeof',
        value: this.ifTypeof,
        ...modifiers,
      };
    }
    if (this.ifProperty) {
      return {
        type: 'if-property',
        value: this.ifProperty,
        ...modifiers,
        comparison,
      };
    }
    if (this.ifRev) {
      return {
        type: 'if-rev',
        value: this.ifRev,
        ...modifiers,
        comparison,
      };
    }
    return this.else ? ELSE_RULE : NEVER_RULE;
  }

  private getComparison(): Comparison | undefined {
    return (
      this.comparisonFor(this.someValueEq, 'some', 'eq') ??
      this.comparisonFor(this.everyValueEq, 'every', 'eq') ??
      this.comparisonFor(this.someValueGt, 'some', 'gt') ??
      this.comparisonFor(this.everyValueGt, 'every', 'gt') ??
      this.comparisonFor(this.someValueGte, 'some', 'gte') ??
      this.comparisonFor(this.everyValueGte, 'every', 'gte') ??
      this.comparisonFor(this.someValueLt, 'some', 'lt') ??
      this.comparisonFor(this.everyValueLt, 'every', 'lt') ??
      this.comparisonFor(this.someValueLte, 'some', 'lte') ??
      this.comparisonFor(this.everyValueLte, 'every', 'lte')
    );
  }

  private comparisonFor(target: string | undefined, semantic: Semantic, operator: Operator): Comparison | undefined {
    if (target) {
      return { semantic, operator, target };
    }
  }

  componentWillLoad() {
    const templateElement = this.host.querySelector('template');
    if (templateElement == null) {
      this.error = 'No template element found';
    } else {
      this.templateHTML = templateElement.innerHTML;
    }
  }

  render() {
    if (this.error) return <div class="error">{this.error}</div>;

    if (!this.active) {
      // because we set innerHTML for active case elements, we need to
      // unset it here to not leave state in the dom
      return <Host innerHTML=""></Host>;
    }
    return <Host innerHTML={this.templateHTML}></Host>;
  }
}
