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
        <ion-content class="ion-padding">
          <pos-resource uri="http://localhost:3000/alice/games/minecraft#it">
            <ion-grid>
              <ion-row>
                <ion-col size="12" size-sm>
                  <ion-card>
                    <ion-card-header>
                      <img src="https://upload.wikimedia.org/wikipedia/de/5/57/Minecraft_logo-SVG.svg" />
                      <ion-card-subtitle>VideoGame</ion-card-subtitle>
                      <ion-card-title>
                        <pos-label />
                      </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      Minecraft is a sandbox video game developed by the Swedish video game developer Mojang Studios. The game was created by Markus "Notch" Persson in the Java
                      programming language.
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
          </pos-resource>
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
