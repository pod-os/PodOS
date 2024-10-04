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
        <div class="container">
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
          {!session.state.isLoggedIn && (
            <button id="login" onClick={() => this.openDialog()}>
              Login
            </button>
          )}
          {session.state.isLoggedIn && (
            <button id="logout" onClick={() => this.logout()}>
              Logout
            </button>
          )}
        </div>
        <pos-dialog ref={el => (this.dialog = el as HTMLPosDialogElement)}>
          <span slot="title">Sign in to your Pod</span>
          <pos-login-form onPod-os:idp-url-selected={ev => this.login(ev)} slot="content" />
        </pos-dialog>
      </Host>
    );
  }
}
