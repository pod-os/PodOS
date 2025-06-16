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

  receiveResource = (resource: Thing) => {
    this.items = [];
    if (this.rel) this.items = resource.relations(this.rel).flatMap(relation => relation.uris);
  };

  render() {
    if (this.error) return this.error;
    const elems = this.items.map(it => (
      <pos-resource uri={it} innerHTML={this.templateString} about={it}></pos-resource>
    ));
    return this.items.length > 0 ? elems : null;
  }
}
