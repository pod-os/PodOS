import { PodOS } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-new-thing-form',
  styleUrl: 'pos-new-thing-form.css',
  shadow: false,
})
export class PosNewThingForm implements PodOsAware {
  @Prop() referenceUri!: string;
  @State() os!: PodOS;

  @State() newUri: string = '';
  @State() name: string = '';
  @State() selectedTypeUri: string | undefined = undefined;

  @State() canSubmit: boolean = false;

  @Event({ eventName: 'pod-os:link' }) linkEmitter!: EventEmitter;
  @Event({ eventName: 'pod-os:error' }) errorEmitter!: EventEmitter;

  @Watch('name')
  @Watch('selectedTypeUri')
  validate() {
    this.canSubmit = Boolean(this.name);
  }

  componentWillLoad() {
    subscribePodOs(this);
  }
  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  @Event({ eventName: 'pod-os:init' }) subscribePodOs!: PodOsEventEmitter;

  render() {
    return (
      <form method="dialog" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="type">Type</label>
        <pos-select-term
          id="type"
          placeholder=""
          value={this.selectedTypeUri}
          onPod-os:term-selected={e => this.onTermSelected(e)}
        />
        <label htmlFor="name">Name</label>
        <input autofocus={true} id="name" type="text" value={this.name} onInput={e => this.handleChange(e)} />
        {this.newUri ? (
          <div id="new-uri" title="This will be the URI of the new thing">
            {this.newUri}
          </div>
        ) : null}
        <input id="create" type="submit" value="Create" disabled={!this.canSubmit} />
      </form>
    );
  }

  handleChange(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
    this.newUri = this.os.proposeUriForNewThing(this.referenceUri, this.name);
  }

  onTermSelected(event: CustomEvent) {
    this.selectedTypeUri = event.detail.uri;
  }

  async handleSubmit(event: Event) {
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
    this.selectedTypeUri = undefined;
  }
}
