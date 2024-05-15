import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-app-browser',
})
export class PosAppBrowser {
  render() {
    return (
      <pos-app restorePreviousSession={true}>
        <pos-error-toast>
          <ion-app>
            <ion-header>
              <ion-toolbar>
                <ion-title slot="start">PodOS</ion-title>
                <pos-login></pos-login>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <pos-router />
            </ion-content>
            <ion-footer>
              <ion-toolbar>
                <ion-title>PodOS Browser</ion-title>
              </ion-toolbar>
            </ion-footer>
          </ion-app>
        </pos-error-toast>
      </pos-app>
    );
  }
}
