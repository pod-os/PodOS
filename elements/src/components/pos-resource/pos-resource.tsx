import { PodOS, Thing } from '@pod-os/core';
import { Component, EventEmitter, Event, h, Prop, State, Watch, Listen, Method } from '@stencil/core';

import session from '../../store/session';

interface GetResourceEvent extends CustomEvent {
  detail: (Thing) => void;
}

@Component({
  tag: 'pos-resource',
  shadow: true,
})
export class PosResource {
  @State() os: PodOS;

  @State() resource: Thing;
  @State() consumers: GetResourceEvent[] = [];

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
  async provideResource(event: GetResourceEvent) {
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
