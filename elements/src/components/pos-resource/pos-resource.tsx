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
      return <div>{this.error.message}</div>;
    }
    return <slot />;
  }
}
