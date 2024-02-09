import { Component, h } from '@stencil/core';

import '@pod-os/elements';

@Component({
  tag: 'pos-contacts-app',
})
export class App {
  render() {
    return (
      <pos-app>
        <header>
          <h1>Contacts</h1>
          <pos-login></pos-login>
        </header>
        <main>
          <pos-contacts />
        </main>
        <footer></footer>
      </pos-app>
    );
  }
}
