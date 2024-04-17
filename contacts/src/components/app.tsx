import { Component, h, Listen } from '@stencil/core';

import '@pod-os/elements';

@Component({
  tag: 'pos-contacts-app',
})
export class App {
  @Listen('pod-os:session-changed')
  sessionChanged(ev) {
    console.log('app session changed', ev.detail);
  }

  render() {
    return (
      <pos-app>
        <pos-contacts-router />
      </pos-app>
    );
  }
}
