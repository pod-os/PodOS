import { Component, h } from '@stencil/core';

import '@pod-os/elements';

@Component({
  tag: 'pos-app-contacts',
})
export class PosAppContacts {
  render() {
    return (
      <pos-app>
        <header>
          <h1>Contacts</h1>
          <pos-login></pos-login>
        </header>
        <main></main>
        <footer></footer>
      </pos-app>
    );
  }
}
