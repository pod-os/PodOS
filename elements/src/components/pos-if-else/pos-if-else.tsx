import { Thing } from '@pod-os/core';
import { Component, Element, Event, h, Host, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-if-else',
  shadow: false,
})
export class PosIfElse implements ResourceAware {
  @Element() host: HTMLElement;
  @State() error: string = null;
  @State() resource: Thing;
  @State() conditionElements: NodeListOf<HTMLTemplateElement>;
  @State() templateString: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    subscribeResource(this);

    const templateElements = this.host.querySelectorAll('template');
    if (templateElements.length == 0) {
      this.error = 'No template elements found';
    } else {
      this.conditionElements = templateElements;
    }
  }

  test(conditionElement): Boolean {
    let state = null;
    if (conditionElement.getAttribute('if-typeof') !== null)
      state = this.resource
        .types()
        .map(x => x.uri)
        .includes(conditionElement.getAttribute('if-typeof'));
    if (conditionElement.getAttribute('not') != null) state = !state;
    return state;
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    if (this.error) return this.error;
    if (!this.resource) return null;
    let state = null;
    let activeElements: HTMLTemplateElement[] = [];
    this.conditionElements.forEach(el => {
      const elemState = this.test(el);
      const includeCondition = !state === true || el.getAttribute('else') === null;
      if (elemState && includeCondition) {
        state = elemState;
        activeElements.push(el);
      }
      if (elemState === null && includeCondition) {
        activeElements.push(el);
      }
    });
    const activeElementsContent = activeElements.map(el => el.innerHTML).join('\n');
    return <Host innerHTML={activeElementsContent}></Host>;
  }
}
