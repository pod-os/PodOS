import { PodOS } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-navigation-bar',
  shadow: true,
})
export class PosNavigationBar implements PodOsAware {
  @State() os: PodOS;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;
  @Prop() uri: string = '';

  @State() value: string = this.uri;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  componentWillLoad() {
    subscribePodOs(this);
  }

  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  private onChange(event) {
    this.value = event.detail.value;
  }

  private onSubmit(event) {
    event.preventDefault();
    this.linkEmitter.emit(this.value);
  }

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <ion-searchbar
          enterkeyhint="search"
          placeholder="Enter URI"
          value={this.uri}
          debounce={0}
          onIonChange={e => this.onChange(e)}
        />
      </form>
    );
  }
}
