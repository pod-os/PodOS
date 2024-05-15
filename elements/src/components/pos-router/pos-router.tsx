import { Component, h, Listen, State } from '@stencil/core';

import { createRouter, match, Route } from 'stencil-router-v2';

const Router = createRouter();

@Component({
  tag: 'pos-router',
  styleUrl: 'pos-router.css',
})
export class PosRouter {
  @State() uri;

  @Listen('pod-os:link')
  linkClicked(e) {
    this.navigate(e.detail);
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
    this.uri = new URLSearchParams(window.location.search).get('uri') || window.location.href;
  }

  render() {
    return (
      <Router.Switch>
        <Route path={match('', { exact: false })}>
          <div class="toolbar">
            <pos-add-new-thing referenceUri={this.uri}></pos-add-new-thing>
            <pos-navigation-bar uri={this.uri}></pos-navigation-bar>
          </div>
          <pos-resource key={this.uri} uri={this.uri}>
            <pos-type-router />
          </pos-resource>
        </Route>
      </Router.Switch>
    );
  }
}
