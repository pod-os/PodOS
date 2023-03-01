import { PodOS, Thing } from '@pod-os/core';
import { Component, Host, h, State, Event, Watch } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-add-literal-value',
  styleUrl: 'pos-add-literal-value.css',
  shadow: true,
})
export class PosAddLiteralValue implements ResourceAware, PodOsAware {
  @State() os: PodOS;
  @State() resource: Thing;

  @State() currentValue: string;
  @State() selectedTermUri: string;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: ResourceEventEmitter;

  @Watch('os')
  setName() {}

  componentWillLoad() {
    subscribeResource(this);
    subscribePodOs(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  save() {
    this.os.addPropertyValue(this.resource, this.selectedTermUri, this.currentValue);
  }

  render() {
    if (!this.resource?.editable) {
      return;
    }
    return (
      <Host>
        <pos-select-term onPod-os:term-selected={ev => (this.selectedTermUri = ev.detail.uri)} />
        <ion-input placeholder="Enter value" onIonChange={ev => (this.currentValue = ev.detail.value.toString())} onChange={() => this.save()}></ion-input>
      </Host>
    );
  }
}
