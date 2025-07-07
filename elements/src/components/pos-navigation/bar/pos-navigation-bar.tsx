import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { Thing } from '@pod-os/core';

@Component({
  tag: 'pos-navigation-bar',
  shadow: true,
  styleUrl: 'pos-navigation-bar.css',
})
export class PosNavigationBar {
  @Prop() current: Thing;

  @Event({ eventName: 'pod-os:navigate' }) navigate: EventEmitter;

  private onClick() {
    this.navigate.emit();
  }

  render() {
    return (
      <nav>
        <button onClick={() => this.onClick()}>{this.current.label()}</button>
      </nav>
    );
  }
}
