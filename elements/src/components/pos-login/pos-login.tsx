import { Component, EventEmitter, h, Event, Host, State } from '@stencil/core';

import session from '../../store/session';

@Component({
  tag: 'pos-login',
})
export class PosLogin {
  @Event({ eventName: 'consumeOs' }) consumeOsEmitter: EventEmitter;

  @State() os: any;

  componentWillLoad() {
    this.consumeOsEmitter.emit(this.setOs);
  }

  setOs = async (os: any) => {
    this.os = os;
  };

  login() {
    const idp = session.getIdpUrl();
    this.os.login(idp);
  }

  logout() {
    this.os.logout();
  }

  render() {
    return (
      <Host>
        {session.isLoggedIn ? (
          <pos-resource uri={session.webId}>
            <pos-label />
          </pos-resource>
        ) : (
          ''
        )}
        {!session.isLoggedIn && <ion-button onClick={() => this.login()}>Login</ion-button>}
        {session.isLoggedIn && <ion-button onClick={() => this.logout()}>Logout</ion-button>}
      </Host>
    );
  }
}
