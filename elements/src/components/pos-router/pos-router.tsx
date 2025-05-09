import { Component, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';

import { createRouter } from 'stencil-router-v2';

const Router = createRouter();

/**
 * The responsibility of pos-router is to handle the `uri` query param, that specifies the URI of the resource that is currently opened.
 * It reads this query param and informs other components about changes via the `pod-os:route-changed` event.
 * It also intercepts the URLs from `pod-os:link` events and pushes them as a new `uri` parameter.
 */
@Component({
  tag: 'pos-router',
  styleUrl: 'pos-router.css',
})
export class PosRouter {
  /**
   * The mode defines what default URI will be used, if no URI param is given
   *
   * - standalone: reroute to pod-os:dashboard
   * - pod: reroute to the URI that is shown in the actual browser
   */
  @Prop() mode: 'standalone' | 'pod' = 'standalone';

  @State() uri;

  /**
   * Emits the new URI that is active
   */
  @Event({ eventName: 'pod-os:route-changed' }) routeChanged: EventEmitter<string>;

  @Listen('pod-os:link')
  linkClicked(e) {
    this.navigate(e.detail);
  }

  @Listen('pod-os:session-restored', { target: 'window' })
  sessionRestored(e) {
    Router.push(e.detail.url);
  }

  componentWillLoad() {
    this.updateUri();
    Router.onChange('url', () => {
      this.updateUri();
    });
  }

  navigate(uri: string) {
    Router.push('?uri=' + encodeURIComponent(uri));
  }

  updateUri() {
    this.uri =
      new URLSearchParams(window.location.search).get('uri') ||
      (this.mode === 'standalone' ? 'pod-os:dashboard' : window.location.href);
    this.routeChanged.emit(this.uri);
  }

  render() {
    return <slot></slot>;
  }
}
