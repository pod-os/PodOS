import { PodOS, Thing } from '@pod-os/core';
import { Component, Element, Event, h, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';
import { Subject } from 'rxjs';

@Component({
  tag: 'pos-list',
  shadow: false,
})
export class PosList implements PodOsAware, ResourceAware {
  /**
   * URI of the predicate to follow
   */
  @Prop() rel: string;
  /**
   * URI of a class for which instances will be listed
   */
  @Prop() ifTypeof: string;
  /**
   * Whether listed resources should be fetched before being displayed
   */
  @Prop() fetch: boolean = false;

  @Element() host: HTMLElement;
  @State() error: string = null;
  @State() os: PodOS;
  @State() resource: Thing;
  @State() items: string[] = [];
  @State() templateString: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;
  @Event({ eventName: 'pod-os:init' })
  subscribePodOs: PodOsEventEmitter;

  private readonly disconnected$ = new Subject<void>();

  componentWillLoad() {
    if (this.rel) subscribeResource(this);
    if (this.ifTypeof) subscribePodOs(this);
    const templateElement = this.host.querySelector('template');
    if (templateElement == null) {
      this.error = 'No template element found';
    } else {
      this.templateString = templateElement.innerHTML;
    }
  }

  receiveResource = (resource: Thing) => {
    if (this.rel) this.items = resource.relations(this.rel).flatMap(relation => relation.uris);
  };

  receivePodOs = async (os: PodOS) => {
    this.os = os;
    os.store.observeFindMembers(this.ifTypeof, this.disconnected$).subscribe(value => (this.items = value));
  };

  render() {
    if (this.error) return this.error;
    const elems = this.items.map(it => (
      <pos-resource uri={it} lazy={!this.fetch} innerHTML={this.templateString} about={it}></pos-resource>
    ));
    return this.items.length > 0 ? elems : null;
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.unsubscribe();
  }
}
