import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../../components/events/ResourceAware';

@Component({
  tag: 'pos-app-image-viewer',
  shadow: true,
  styles: `
    pos-image {
      --max-width: 100%;
    }
  `,
})
export class PosAppImageViewer implements ResourceAware {
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    if (!this.resource) {
      return null;
    }

    return (
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-sm>
            <pos-image src={this.resource.uri} />
          </ion-col>
          <ion-col size="12" size-sm>
            <ion-card>
              <ion-card-header style={{ gap: 'var(--size-1)' }}>
                <ion-card-title>
                  <pos-label />
                </ion-card-title>
                <pos-type-badges />
                <pos-literals />
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
