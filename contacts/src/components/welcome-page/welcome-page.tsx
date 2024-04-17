import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-contacts-welcome-page',
  styleUrl: './welcome-page.css',
  shadow: true,
})
export class WelcomePage {
  render() {
    return (
      <Host>
        <header>
          <h1>PodOS contacts</h1>
          <pos-login></pos-login>
        </header>
        <main>
          <pos-contacts-open-address-book />
        </main>
      </Host>
    );
  }
}
