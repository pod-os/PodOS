import { PodOS, Thing } from '@pod-os/core';
import { Component, Event, h, State } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-label',
  shadow: true,
})
export class PosLabel implements ResourceAware, PodOsAware {
  @State() resource: Thing;
  @State() os: PodOS;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  private span?: HTMLSpanElement;

  componentWillLoad() {
    subscribeResource(this);
    subscribePodOs(this);
  }

  componentDidRender() {
    if (this.os) {
      this.os.uix.process(this.span, this.span); // uix needs to process the dynamically added element
    }
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  receivePodOs = (os: PodOS) => {
    this.os = os;
  };

  render() {
    return this.resource ? <span ref={el => (this.span = el)} data-uix="profileOwnerName" data-from={this.resource.uri}></span> : null;
  }
}
