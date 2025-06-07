import { Thing, PodOS } from '@pod-os/core';
import { Component, Element, Event, h, Prop, State, Watch } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, ResourceReceiver, subscribeResource } from '../events/ResourceAware';
import { PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

interface SubscribeResourceEvent extends CustomEvent {
  detail: ResourceReceiver;
  currentTarget: HTMLElement;
}

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
  @State() os: PodOS;
  @State() error: string = null;
  @State() resource: Thing;
  @State() items: string[] = [];
  @State() templateNodeName: string;
  @State() templateString: string;
  @State() provideQueue: SubscribeResourceEvent[] = [];

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;
  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  componentWillLoad() {
    subscribePodOs(this);
    subscribeResource(this);
    let templateElement = this.host.querySelector('template');
    if (templateElement == null) {
      this.error = 'No template element found';
    } else if (templateElement.content.childElementCount != 1) {
      this.error = 'Template element should only have one child, e.g. li';
    } else {
      this.templateNodeName = templateElement.content.firstElementChild.nodeName.toLowerCase();
      this.templateString = templateElement.content.firstElementChild.innerHTML;
    }
  }

  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  receiveResource = (resource: Thing) => {
    this.items = [];
    if (this.rel) this.items = resource.relations(this.rel).flatMap(relation => relation.uris);
  };

  @Watch('os')
  private async provideResources() {
    while (this.provideQueue.length > 0) {
      let ev = this.provideQueue.pop();
      let resourceUri = ev.currentTarget.getAttribute('about');
      let resource = this.os.store.get(resourceUri);
      if (resource) {
        ev.detail(resource);
      } else {
        this.provideQueue.push(ev);
      }
    }
  }

  async provideResource(event: SubscribeResourceEvent) {
    event.stopPropagation();
    this.provideQueue.push(event);
    this.provideResources();
  }

  render() {
    if (this.error) return this.error;
    const elems = this.items.map(it => (
      <this.templateNodeName
        innerHTML={this.templateString}
        about={it}
        onPod-os:resource={ev => this.provideResource(ev)}
      ></this.templateNodeName>
    ));
    return this.items.length > 0 ? elems : null;
  }
}
