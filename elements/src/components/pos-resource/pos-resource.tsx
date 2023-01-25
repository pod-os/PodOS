import { PodOS, Thing } from '@pod-os/core';
import { Component, EventEmitter, Event, h, Prop, State, Watch, Listen, Method } from '@stencil/core';

import session from '../../store/session';
import { ResourceReceiver } from '../events/ResourceAware';

interface SubscribeResourceEvent extends CustomEvent {
  detail: ResourceReceiver;
}

@Component({
  tag: 'pos-resource',
  shadow: true,
})
export class PosResource {
  @State() os: PodOS;

  @State() resource: Thing;
  @State() consumers: SubscribeResourceEvent[] = [];

  @Prop() uri: string;

  @Prop() lazy: boolean = false;

  @Event({ eventName: 'pod-os:init' }) initializeOsEmitter: EventEmitter;

  /**
   * Indicates that the resource given in `uri` property has been loaded.
   */
  @Event({ eventName: 'pod-os:resource-loaded' }) resourceLoadedEmitter: EventEmitter;

  @State()
  private error: Error;

  @State()
  private loading: boolean = true;

  componentWillLoad() {
    session.onChange('isLoggedIn', () => this.loadResource());
    this.initializeOsEmitter.emit(this.setOs);
  }

  setOs = async (os: PodOS) => {
    this.os = os;
  };

  @Listen('pod-os:resource')
  async provideResource(event: SubscribeResourceEvent) {
    event.stopPropagation();
    if (this.resource) {
      event.detail(this.resource);
    }
    this.consumers.push(event);
  }

  @Watch('os')
  @Watch('uri')
  async loadResource() {
    await this.getResource(!this.lazy);
  }

  @Method()
  async fetch() {
    await this.getResource(true);
  }

  private async getResource(fetch: boolean = false) {
    try {
      if (fetch) {
        this.loading = true;
        await this.os.fetch(this.uri);
        this.resourceLoadedEmitter.emit(this.uri);
      }
      this.resource = this.os.store.get(this.uri);
      this.error = null;
      this.consumers.forEach(consumer => {
        consumer.detail(this.resource);
      });
    } catch (err) {
      this.error = err;
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return <ion-progress-bar type="indeterminate" />;
    }
    if (this.error) {
      return (
        <ion-card>
          <ion-card-header>
            <p>Sorry, something went wrong</p>
            <p>
              Status:
              {
                // @ts-ignore
                this.error.status
              }
            </p>
            <details>{this.error.message}</details>
          </ion-card-header>
          <ion-card-content>
            <p>You can try to open the link outside PodOS:</p>
            <a href={this.uri}>{this.uri}</a>
          </ion-card-content>
        </ion-card>
      );
    }
    return <slot />;
  }
}
