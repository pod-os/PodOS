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
                  <ion-list>
                    <ion-item-group>
                      <ion-item-divider>
                        <ion-label>schema:playMode</ion-label>
                      </ion-item-divider>
                      <ion-item>
                        <ion-label>SinglePlayer</ion-label>
                      </ion-item>
                      <ion-item>
                        <ion-label>MultiPlayer</ion-label>
                      </ion-item>
                    </ion-item-group>

                    <ion-item-group>
                      <ion-item-divider>
                        <ion-label>schema:gamePlatform</ion-label>
                      </ion-item-divider>
                      <ion-item>
                        <ion-label>Online_gaming_services</ion-label>
                      </ion-item>
                    </ion-item-group>

                    <ion-item-group>
                      <ion-item-divider>
                        <ion-label>schema:url</ion-label>
                      </ion-item-divider>
                      <ion-item>
                        <ion-label>http://www.mineplex.com/</ion-label>
                      </ion-item>
                    </ion-item-group>

                    <ion-item-group>
                      <ion-item-divider>
                        <ion-label>schema:name</ion-label>
                      </ion-item-divider>
                      <ion-item>
                        <ion-label>Minecraft</ion-label>
                      </ion-item>
                    </ion-item-group>

                    <ion-item-group>
                      <ion-item-divider>
                        <ion-label>schema:description</ion-label>
                      </ion-item-divider>
                      <ion-item>
                        <ion-label class="ion-text-wrap">
                          Minecraft is a sandbox video game developed by the Swedish video game developer Mojang Studios. The game was created by Markus "Notch" Persson in the Java
                          programming language.
                        </ion-label>
                      </ion-item>
                    </ion-item-group>
                  </ion-list>
                </ion-col>
                <ion-col size="12" size-sm>
                  <ion-list>
                    <ion-item-group>
                      <ion-item-divider>
                        <ion-label>schema:video</ion-label>
                      </ion-item-divider>

                      <ion-item>
                        <ion-toolbar>
                          <ion-label>
                            <h2>CHALLENGE ACCEPTED! #6 [Hot Pepper Challenge!]</h2>
                            <p>
                              How many Jalapeno can I eat without crying? ZERO. Today's challenge is for every chest I open, I have to eat a Jalapeno and... I HAVE TO WIN. This
                              video was painful
                            </p>
                          </ion-label>

                          <ion-buttons slot="secondary">
                            <ion-button slot="end">
                              <ion-icon name="open-outline" />
                            </ion-button>
                          </ion-buttons>
                        </ion-toolbar>
                      </ion-item>
                      <ion-item>
                        <ion-toolbar>
                          <ion-label>
                            <h2>How to Build a Castle</h2>
                            <p>Today I will show you how to build a giant castle.</p>
                          </ion-label>

                          <ion-buttons slot="secondary">
                            <ion-button slot="end">
                              <ion-icon name="open-outline" />
                            </ion-button>
                          </ion-buttons>
                        </ion-toolbar>
                      </ion-item>
                    </ion-item-group>

                    <ion-item-group>
                      <ion-item-divider>
                        <ion-label>schema:gameServer</ion-label>
                      </ion-item-divider>
                      <ion-item>
                        <ion-toolbar>
                          <ion-label>mineplex</ion-label>

                          <ion-buttons slot="secondary">
                            <ion-button slot="end">
                              <ion-icon name="open-outline" />
                            </ion-button>
                          </ion-buttons>
                        </ion-toolbar>
                      </ion-item>
                    </ion-item-group>
                  </ion-list>
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
