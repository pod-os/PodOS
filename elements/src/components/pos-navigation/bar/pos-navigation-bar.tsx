import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { Thing } from '@pod-os/core';

@Component({
  tag: 'pos-navigation-bar',
  shadow: true,
  styleUrl: 'pos-navigation-bar.css',
})
export class PosNavigationBar {
  @Prop() current?: Thing;
  @Prop() searchIndexReady: boolean;

  @Event({ eventName: 'pod-os:navigate' }) navigate: EventEmitter;

  private onClick() {
    this.navigate.emit();
  }

  render() {
    if (!this.current) return <nav></nav>;
    return (
      <nav>
        <button onClick={() => this.onClick()}>{this.current.label()}</button>
        {this.searchIndexReady && <pos-make-findable uri={this.current.uri}></pos-make-findable>}
      </nav>
    );
  }
}
