import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pos-app-browser',
  styleUrl: 'pos-app-browser.css',
})
export class PosAppBrowser {
  @Prop() restorePreviousSession: boolean = false;

  render() {
    return (
      <Host>
        <pos-app restorePreviousSession={this.restorePreviousSession}>
          <pos-error-toast>
            <header>
              <pos-login></pos-login>
            </header>
            <main>
              <pos-router />
            </main>
            <footer>PodOS Browser</footer>
          </pos-error-toast>
        </pos-app>
      </Host>
    );
  }
}
