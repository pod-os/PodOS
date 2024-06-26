import { Component, h } from '@stencil/core';

import '@pod-os/elements';

@Component({
  tag: 'pos-contacts-app',
})
export class App {
  render() {
    return (
      <pos-app restore-previous-session={true}>
        <pos-contacts-router />
      </pos-app>
    );
  }
}
