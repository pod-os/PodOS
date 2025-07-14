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
    this.navigate.emit(this.current);
  }

  render() {
    const ariaLabel = this.current ? `${this.current.label()} (Click to search or enter URI)` : 'Search or enter URI';

    return (
      <section class="current">
        {this.current && this.searchIndexReady && <pos-make-findable uri={this.current.uri}></pos-make-findable>}
        <button aria-label={ariaLabel} onClick={() => this.onClick()}>
          {this.current ? this.current.label() : 'Search or enter URI'}
        </button>
      </section>
    );
  }
}
