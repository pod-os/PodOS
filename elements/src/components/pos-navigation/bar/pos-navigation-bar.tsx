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
    return (
      <nav>
        <section class="current">
          {this.current && this.searchIndexReady && <pos-make-findable uri={this.current.uri}></pos-make-findable>}
          <button onClick={() => this.onClick()}>{this.current ? this.current.label() : 'Search or enter URI'}</button>
        </section>
      </nav>
    );
  }
}
