import { Component, Event, EventEmitter, h, Listen, Prop } from '@stencil/core';
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

  @Listen('keydown', { target: 'document' })
  activate(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.navigate.emit(this.current);
    }
  }

  render() {
    const ariaLabel = this.current ? `${this.current.label()} (Click to search or enter URI)` : 'Search or enter URI';

    return (
      <section class="current">
        {this.current && this.searchIndexReady && <pos-make-findable uri={this.current.uri}></pos-make-findable>}
        <button aria-label={ariaLabel} onClick={() => this.onClick()}>
          <div>{this.current ? this.current.label() : 'Search or enter URI'}</div>
          {this.icon()}
        </button>
        {this.current && <pos-share uri={this.current.uri}></pos-share>}
      </section>
    );
  }

  private icon() {
    return (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    );
  }
}
