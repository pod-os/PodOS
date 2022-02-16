import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-app-generic',
})
export class PosAppGeneric {
  render() {
    return (
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-sm>
            <ion-card>
              <ion-card-header>
                <img src="https://dummyimage.com/250/ffffff/000000" />
                <ion-card-title>
                  <pos-label />
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <pos-description />
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-sm>
            <pos-literals />
          </ion-col>
          <ion-col size="12" size-sm>
            <pos-relations />
          </ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
