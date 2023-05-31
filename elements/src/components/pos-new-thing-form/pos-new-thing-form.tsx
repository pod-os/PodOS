import { PodOS } from '@pod-os/core';
import { Component, Event, h, Prop, State, Watch } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-new-thing-form',
  styleUrl: 'pos-new-thing-form.css',
  shadow: true,
})
export class PosNewThingForm implements PodOsAware {
  @Prop() referenceUri!: string;
  @State() os: PodOS;

  @State() newUri: string;
  @State() name: string;
  @State() selectedTypeUri: string;

  @State() canSubmit: boolean = false;

  @Watch('name')
  @Watch('selectedTypeUri')
  validate() {
    this.canSubmit = Boolean(this.name && this.selectedTypeUri);
  }

  componentWillLoad() {
    subscribePodOs(this);
  }
  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  render() {
    return (
      <form>
        <label>
          Type
          <pos-select-term onPod-os:term-selected={e => this.onTermSelected(e)} />
        </label>
        <label>
          Name
          <input type="text" value={this.name} onInput={e => this.handleChange(e)} />
        </label>
        <div>{this.newUri}</div>
        <input type="submit" value="Create" disabled={!this.canSubmit} />
      </form>
    );
  }

  handleChange(event) {
    this.name = event.target.value;
    this.newUri = this.os.proposeUriForNewThing(this.referenceUri, this.name);
  }

  onTermSelected(event) {
    this.selectedTypeUri = event.detail.uri;
  }
}
