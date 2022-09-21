import { PodOS } from '@pod-os/core/src';
import { Component, EventEmitter, h, Event, Host, State } from '@stencil/core';

import session from '../../store/session';

@Component({
  tag: 'pos-login',
})
export class PosLogin {
  @Event({ eventName: 'pod-os:init' }) initializeOsEmitter: EventEmitter;

  @State() os: PodOS;

  componentWillLoad() {
    this.initializeOsEmitter.emit(this.setOs);
  }

  setOs = async (os: PodOS) => {
    this.os = os;
  };

  login() {
    const idp = session.state.getIdpUrl();
    this.os.login(idp);
  }

  logout() {
    this.os.logout();
  }

  render() {
    return (
      <Host>
        {session.state.isLoggedIn ? (
          <pos-resource uri={session.state.webId}>
            <pos-label />
          </pos-resource>
        ) : (
          ''
        )}
        {!session.state.isLoggedIn && <ion-button onClick={() => this.login()}>Login</ion-button>}
        {session.state.isLoggedIn && <ion-button onClick={() => this.logout()}>Logout</ion-button>}
      </Host>
    );
  }
}
