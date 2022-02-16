import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-demo-app',
})
export class PosDemoApp {
  render() {
    return (
      <pos-app>
        <ion-header>
          <ion-toolbar>
            <ion-title slot="start">pod os</ion-title>
            <pos-login></pos-login>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <pos-router />
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <ion-title>Footer</ion-title>
          </ion-toolbar>
        </ion-footer>
      </pos-app>
    );
  }
}
