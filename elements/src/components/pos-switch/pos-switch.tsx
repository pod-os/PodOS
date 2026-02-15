import { Thing } from '@pod-os/core';
import { Component, Element, Event, h, Host, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

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
  @State() caseElements: NodeListOf<HTMLPosCaseElement>;
  @State() templateString: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    subscribeResource(this);

    const caseElements = this.host.querySelectorAll('pos-case');
    if (caseElements.length == 0) {
      this.error = 'No pos-case elements found';
    } else {
      this.caseElements = caseElements;
    }
  }

  test(caseElement): boolean {
    let state = null;
    if (caseElement.getAttribute('if-typeof') !== null) {
      state = this.resource
        .types()
        .map(x => x.uri)
        .includes(caseElement.getAttribute('if-typeof'));
    }
    if (caseElement.getAttribute('if-property') !== null) {
      const relations = this.resource.relations(caseElement.getAttribute('if-property'));
      state = relations.length > 0;
    }
    if (caseElement.getAttribute('if-rev') !== null) {
      const reverseRelations = this.resource.reverseRelations(caseElement.getAttribute('if-rev'));
      state = reverseRelations.length > 0;
    }
    if (caseElement.getAttribute('not') != null) {
      state = !state;
    }
    return state;
  }

  receiveResource = (resource: Thing) => {
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
}
