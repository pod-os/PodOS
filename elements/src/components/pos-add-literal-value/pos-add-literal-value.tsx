import { Literal, PodOS, Thing } from '@pod-os/core';
import { Component, Host, h, State, Event, Watch, EventEmitter } from '@stencil/core';
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

  /**
   * The entered literal value has been added to the resource and successfully stored to the Pod.
   */
  @Event({ eventName: 'pod-os:added-literal-value' }) addedLiteralValue: EventEmitter;

  /**
   * Something went wrong while adding the literal value.
   */
  @Event({ eventName: 'pod-os:error' }) error: EventEmitter;

  @Watch('os')
  setName() {}

  private valueInput: HTMLIonInputElement;

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

  async save() {
    try {
      await this.os.addPropertyValue(this.resource, this.selectedTermUri, this.currentValue);
      const literal: Literal = {
        predicate: this.selectedTermUri,
        values: [this.currentValue],
      };
      this.addedLiteralValue.emit(literal);
      this.currentValue = '';
    } catch (err) {
      this.error.emit(err);
    }
  }

  onTermSelected(event) {
    this.selectedTermUri = event.detail.uri;
    this.valueInput.setFocus();
  }

  render() {
    if (!this.resource?.editable) {
      return;
    }
    return (
      <Host>
        <ion-icon name="add-circle-outline"></ion-icon>
        <pos-select-term placeholder="Add literal" onPod-os:term-selected={ev => this.onTermSelected(ev)} />
        <ion-input
          ref={el => (this.valueInput = el)}
          value={this.currentValue}
          placeholder=""
          onIonChange={ev => (this.currentValue = ev.detail.value.toString())}
          onChange={() => this.save()}
        ></ion-input>
      </Host>
    );
  }
}
