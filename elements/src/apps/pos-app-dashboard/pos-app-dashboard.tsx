import { Component, h, Host } from '@stencil/core';

import session from '../../store/session';

@Component({
  tag: 'pos-app-dashboard',
  styleUrl: 'pos-app-dashboard.css',
  shadow: true,
})
export class PosAppDashboard {
  render() {
    return (
      <Host>
        {session.state.isLoggedIn
          ? [<pos-example-resources></pos-example-resources>]
          : [<pos-getting-started></pos-getting-started>, <pos-example-resources></pos-example-resources>]}
      </Host>
    );
  }
}
