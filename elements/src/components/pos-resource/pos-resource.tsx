import { PodOS, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import session from '../../store/session';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';
import { ResourceReceiver } from '../events/ResourceAware';

import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js';

interface SubscribeResourceEvent extends CustomEvent {
  detail: ResourceReceiver;
}

@Component({
  tag: 'pos-resource',
  shadow: true,
  styleUrl: 'pos-resource.css',
})
export class PosResource implements PodOsAware {
  @State() os: PodOS;

  @State() resource: Thing;
  @State() consumers: SubscribeResourceEvent[] = [];

  @Prop() uri: string;

  @Prop() lazy: boolean = false;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

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
    subscribePodOs(this);
  }

  receivePodOs = async (os: PodOS) => {
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
      return <sl-progress-bar indeterminate />;
    }
    if (this.error) {
      return (
        <details class="error">
          <summary title="Click to expand">⚠ Sorry, something went wrong</summary>
          <p>
            Status:
            {
              // @ts-ignore
              this.error.status
            }
          </p>
          <p>{this.error.message}</p>
          <p>
            You can try to open the link outside PodOS: <a href={this.uri}>{this.uri}</a>
          </p>
        </details>
      );
    }
    return <slot />;
  }
}
