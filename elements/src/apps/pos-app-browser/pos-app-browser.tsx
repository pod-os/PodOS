import { Component, h, Host, Prop, State } from '@stencil/core';

@Component({
  tag: 'pos-app-browser',
  styleUrl: 'pos-app-browser.css',
})
export class PosAppBrowser {
  @Prop() restorePreviousSession: boolean = false;

  /**
   * The mode the app is running in:
   *
   * - standalone:  use this when you deploy it as a standalone web application
   * - pod: use this when you host this app as a default interface for you pod
   */
  @Prop() mode: 'standalone' | 'pod' = 'standalone';

  @State() uri = '';

  render() {
    return (
      <Host>
        <pos-app restorePreviousSession={this.restorePreviousSession}>
          <pos-error-toast>
            <pos-router mode={this.mode} onPod-os:route-changed={e => (this.uri = e.detail)}>
              <header>
                <pos-add-new-thing referenceUri={this.uri}></pos-add-new-thing>
                <pos-navigation-bar uri={this.uri === 'pod-os:dashboard' ? '' : this.uri}></pos-navigation-bar>
                <pos-login></pos-login>
              </header>
              <main>
                {this.uri.startsWith('pod-os:') ? (
                  <pos-internal-router uri={this.uri} />
                ) : (
                  <pos-resource key={this.uri} uri={this.uri}>
                    <pos-type-router />
                  </pos-resource>
                )}
              </main>
              <footer>
                <Logo />
                <span>PodOS Browser</span>
                <span>|</span>
                <a class="settings" href="?uri=pod-os%3Asettings">
                  ⚙ Settings
                </a>
              </footer>
            </pos-router>
          </pos-error-toast>
        </pos-app>
      </Host>
    );
  }
}

const Logo = () => {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 350 L50 100 L200 50 L350 100 L350 350 Z"
        style={{
          'fill': '#008BF8',
          'stroke': '#008BF8',
          'stroke-width': '70',
        }}
        stroke-linejoin="round"
      />

      <path
        d="M100 300 L100 150 L200 120 L300 150 L300 300 L130 300 L130 370 L100 370Z"
        style={{
          'fill': 'white',
          'stroke': 'white',
          'stroke-width': '45',
        }}
        stroke-linejoin="round"
      />

      <path
        d="M150 250 L150 200 L200 180 L250 200 L250 250 Z"
        style={{
          'fill': '#DC0073',
          'stroke': '#DC0073',
          'stroke-width': '20',
        }}
        stroke-linejoin="round"
      />
    </svg>
  );
};
