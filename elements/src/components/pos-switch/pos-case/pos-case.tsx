import { Component, Element, Method, Prop, State } from '@stencil/core';
import { NO_RULE, SwitchCaseRule } from '../rules';

/**
 * Defines a template to use if the specified condition is met - to be used with [pos-switch](https://pod-os.org/reference/elements/components/pos-switch/).
 * See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-switch) for an example.
 */
@Component({
  tag: 'pos-case',
  shadow: false,
})
export class PosCase {
  @Element() host!: HTMLElement;
  @State() error: string | null = null;

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

  /**
   * Returns the rule definition for this case. The rule determines if the element's content gets rendered.
   */
  @Method()
  async getRule(): Promise<SwitchCaseRule> {
    const not = this.not;
    if (this.ifTypeof) {
      return {
        type: 'if-typeof',
        value: this.ifTypeof,
        not,
      };
    }
    if (this.ifProperty) {
      return {
        type: 'if-property',
        value: this.ifProperty,
        not,
      };
    }
    if (this.ifRev) {
      return {
        type: 'if-rev',
        value: this.ifRev,
        not,
      };
    }
    return NO_RULE;
  }

  componentWillLoad() {
    const templateElement = this.host.querySelector('template');
    if (templateElement == null) {
      this.error = 'No template element found';
    }
  }

  render() {
    if (this.error) return this.error;
    return null;
  }
}
