import { Component, h, Host, Prop, State } from '@stencil/core';

@Component({
  tag: 'pos-app-browser',
  styleUrl: 'pos-app-browser.css',
})
export class PosAppBrowser {
  @Prop() restorePreviousSession: boolean = false;

  @State() uri = '';

  render() {
    return (
      <Host>
        <pos-app restorePreviousSession={this.restorePreviousSession}>
          <pos-error-toast>
            <pos-router onPod-os:route-changed={e => (this.uri = e.detail)}>
              <header>
                <pos-add-new-thing referenceUri={this.uri}></pos-add-new-thing>
                <pos-navigation-bar uri={this.uri}></pos-navigation-bar>
                <pos-login></pos-login>
              </header>
              <main>
                <pos-resource key={this.uri} uri={this.uri}>
                  <pos-type-router />
                </pos-resource>
              </main>
              <footer>PodOS Browser</footer>
            </pos-router>
          </pos-error-toast>
        </pos-app>
      </Host>
    );
  }
}
