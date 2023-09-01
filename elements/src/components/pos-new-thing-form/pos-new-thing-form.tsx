import { PodOS } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-new-thing-form',
  styleUrl: 'pos-new-thing-form.css',
  shadow: {
    delegatesFocus: true,
  },
})
export class PosNewThingForm implements PodOsAware {
  @Prop() referenceUri!: string;
  @State() os: PodOS;

  @State() newUri: string;
  @State() name: string;
  @State() selectedTypeUri: string;

  @State() canSubmit: boolean = false;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;
  @Event({ eventName: 'pod-os:error' }) errorEmitter: EventEmitter;

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
      <form method="dialog" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="type">Type</label>
        <pos-select-term
          id="type"
          placeholder=""
          value={this.selectedTypeUri}
          onPod-os:term-selected={e => this.onTermSelected(e)}
          autofocus
        />
        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={this.name} onInput={e => this.handleChange(e)} />
        {this.newUri ? (
          <div id="new-uri" title="This will be the URI of the new thing">
            {this.newUri}
          </div>
        ) : null}
        <input id="create" type="submit" value="Create" disabled={!this.canSubmit} />
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

  async handleSubmit(event) {
    try {
      await this.os.addNewThing(this.newUri, this.name, this.selectedTypeUri);
      this.linkEmitter.emit(this.newUri);
      this.reset();
    } catch (error) {
      event.preventDefault();
      this.errorEmitter.emit(error);
    }
  }

  private reset() {
    this.name = '';
    this.newUri = '';
    this.selectedTypeUri = '';
  }
}
