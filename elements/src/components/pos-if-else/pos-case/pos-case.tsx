import { Thing } from '@pod-os/core';
import { Component, Element, Event, h, Host, Method, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../../events/ResourceAware';

/**
 * Defines a template to use if the specified condition is met - to be used with [pos-switch](https://pod-os.org/reference/elements/components/pos-switch/).
 * See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-switch) for an example.
 */
@Component({
  tag: 'pos-case',
  shadow: false,
})
export class PosCase implements ResourceAware {
  /**
   * URI of class with which the subject will be compared
   */
  @Prop() ifTypeof: string;
  /**
   * Negates the result of the test
   */
  @Prop() not: boolean = false;
  /**
   * The test only evaluates to true if tests for preceding templates have failed
   */
  @Prop() else: boolean = false;
  /**
   * Whether case is active and should render
   */
  @Prop() active: boolean = false;

  @Element() host: HTMLElement;
  @State() error: string = null;
  @State() resource: Thing;
  @State() value: boolean;
  @State() templateString: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    subscribeResource(this);

    const templateElement = this.host.querySelector('template');
    if (templateElement == null) {
      this.error = 'No template element found';
    } else {
      this.templateString = templateElement.innerHTML;
    }
  }

  test(): Promise<boolean> {
    let state = null;
    if (this.ifTypeof)
      state = this.resource
        .types()
        .map(x => x.uri)
        .includes(this.ifTypeof);
    if (this.not) state = !state;
    return state;
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    if (this.error) return this.error;
    if (this.active) return <Host innerHTML={this.templateString}></Host>;
    return null;
  }
}
