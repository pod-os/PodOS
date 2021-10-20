import { Component, h, Host } from '@stencil/core';

import session from '../../store/session';

@Component({
  tag: 'pos-login',
})
export class PosLogin {
  login() {
    const idp = session.getIdpUrl();
    session.login(idp);
  }
  render() {
    return (
      <Host>
        {session.isLoggedIn ? session.webId : ''}
        {!session.isLoggedIn && <ion-button onClick={() => this.login()}>Login</ion-button>}
        {session.isLoggedIn && <ion-button onClick={() => session.logout()}>Logout</ion-button>}
      </Host>
    );
  }
}
