import { Component, Element, Prop, State } from '@stencil/core';

/**
 * Defines a template to use if the specified condition is met - to be used with [pos-switch](https://pod-os.org/reference/elements/components/pos-switch/).
 * See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-switch) for an example.
 */
@Component({
  tag: 'pos-case',
  shadow: false,
})
export class PosCase {
  @Element() host: HTMLElement;
  @State() error: string = null;

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
