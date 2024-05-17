import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-app-browser',
})
export class PosAppBrowser {
  @Prop() restorePreviousSession: boolean = false;

  render() {
    return (
      <pos-app restorePreviousSession={this.restorePreviousSession}>
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
