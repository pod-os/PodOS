import { Thing } from '@pod-os/core';
import { Component, Element, Event, h, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-list',
  shadow: false,
})
export class PosList implements ResourceAware {
  /**
   * URI of the predicate to follow
   */
  @Prop() rel: string;

  @Element() host: HTMLDivElement;
  @State() error: string = null;
  @State() resource: Thing;
  @State() items: string[] = [];
  @State() templateNodeName: string;
  @State() templateString: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    subscribeResource(this);
    let templateElement = this.host.querySelector("template")
    if (templateElement == null) {
      this.error = "No template element found"
    } else if (templateElement.content.childElementCount != 1) {
      this.error = "Template element should only have one child, e.g. li"
    } else {
      this.templateNodeName = templateElement.content.firstElementChild.nodeName.toLowerCase()
      this.templateString = templateElement.content.firstElementChild.innerHTML
    }
  }

  receiveResource = (resource: Thing) => {
    this.items = []
    if (this.rel) this.items = resource.relations().filter(relation => relation.predicate == this.rel).flatMap(relation => relation.uris);
  };

  render() {
    if (this.error) return this.error
    const elems = this.items.map(() => (
      <this.templateNodeName innerHTML={this.templateString}></this.templateNodeName>
    ));
    return this.items.length > 0 ? elems : null;
  }
}

