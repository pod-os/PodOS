import { Component, h, Prop } from '@stencil/core';
import { Thing } from '@pod-os/core';

@Component({
  tag: 'pos-navigation-bar',
  shadow: true,
  styleUrl: 'pos-navigation-bar.css',
})
export class PosNavigationBar {
  @Prop() current: Thing;

  render() {
    return (
      <nav>
        <button>{this.current?.label() || 'Navigation'}</button>
      </nav>
    );
  }
}
