import { PodOS } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';

import session from '../../store/session';

@Component({
  tag: 'pos-login',
  shadow: true,
  styleUrl: 'pos-login.css',
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

  login(event: CustomEvent<string>) {
    const idpUrl = event.detail;
    this.os.login(idpUrl);
  }

  logout() {
    this.os.logout();
  }

  private dialog: HTMLPosDialogElement;

  openDialog() {
    this.dialog.showModal();
  }

  render() {
    return (
      <Host>
        {session.state.isLoggedIn ? (
          <pos-resource uri={session.state.webId}>
            <span class="user-data">
              <pos-picture />
              <pos-label />
            </span>
          </pos-resource>
        ) : (
          ''
        )}
        {!session.state.isLoggedIn && <ion-button onClick={() => this.openDialog()}>Login</ion-button>}
        {session.state.isLoggedIn && <ion-button onClick={() => this.logout()}>Logout</ion-button>}
        <pos-dialog ref={el => (this.dialog = el as HTMLPosDialogElement)}>
          <span slot="title">Sign in to your Pod</span>
          <pos-login-form onPod-os:idp-url-selected={ev => this.login(ev)} slot="content" />
        </pos-dialog>
      </Host>
    );
  }
}
