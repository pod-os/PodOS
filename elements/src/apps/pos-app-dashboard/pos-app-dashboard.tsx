import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-app-dashboard',
  styleUrl: 'pos-app-dashboard.css',
  shadow: true,
})
export class PosAppDashboard {
  render() {
    return (
      <Host>
        <pos-getting-started></pos-getting-started>
        <pos-example-resources></pos-example-resources>
      </Host>
    );
  }
}
