import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-app-ldp-container',
})
export class PosAppLdpContainer {
  render() {
    return (
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-sm>
            <pos-container-contents />
          </ion-col>
          <ion-col size="12" size-sm>
            <ion-card>
              <ion-card-header>
                <ion-card-title>
                  <pos-label />
                  <pos-type-badges />
                </ion-card-title>
                <pos-literals />
                <pos-subjects />
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
