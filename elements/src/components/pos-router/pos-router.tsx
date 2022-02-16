import { Component, h, Listen, State } from '@stencil/core';

import { createRouter, match, Route } from 'stencil-router-v2';

const Router = createRouter();

@Component({
  tag: 'pos-router',
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
    console.log('render router', this.uri);
    return (
      <Router.Switch>
        <Route path={match('', { exact: false })}>
          <pos-resource key={this.uri} uri={this.uri}>
            <pos-app-generic />
          </pos-resource>
        </Route>
      </Router.Switch>
    );
  }
}
