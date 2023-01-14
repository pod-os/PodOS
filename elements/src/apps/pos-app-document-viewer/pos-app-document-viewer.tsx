import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../../components/events/ResourceAware';

@Component({
  tag: 'pos-app-document-viewer',
  shadow: true,
})
export class PosAppDocumentViewer implements ResourceAware {
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
            <pos-document src={this.resource.uri} />
          </ion-col>
          <ion-col size="12" size-sm>
            <ion-card>
              <ion-card-header>
                <ion-card-title>
                  <pos-label />
                  <pos-type-badges />
                </ion-card-title>
                <pos-literals />
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
