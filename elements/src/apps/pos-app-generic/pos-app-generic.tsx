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
                <pos-type-badges />
                <pos-picture />
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
            <pos-add-literal-value />
          </ion-col>
          <ion-col size="12" size-sm>
            <pos-relations />
            <pos-reverse-relations />
          </ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
