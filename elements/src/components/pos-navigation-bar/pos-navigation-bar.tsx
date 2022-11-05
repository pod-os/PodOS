import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'pos-navigation-bar',
  shadow: true,
})
export class PosNavigationBar {
  @Prop() uri: string = '';

  @State() value: string = this.uri;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

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
        <ion-searchbar enterkeyhint="search" placeholder="Enter URI" value={this.uri} onIonChange={e => this.onChange(e)} />
      </form>
    );
  }
}
