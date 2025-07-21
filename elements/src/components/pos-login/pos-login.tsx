import { PodOS } from '@pod-os/core';
import { Component, Element, Event, EventEmitter, h, Host, Listen, State } from '@stencil/core';

import session from '../../store/session';

@Component({
  tag: 'pos-login',
  shadow: true,
  styleUrl: 'pos-login.css',
})
export class PosLogin {
  @Event({ eventName: 'pod-os:init' }) initializeOsEmitter: EventEmitter;

  @State() os: PodOS;

  @Element() host: HTMLElement;

  @State()
  private customLoggedInComponent: boolean = false;

  componentWillLoad() {
    this.customLoggedInComponent = !!this.host.querySelector('[slot="if-logged-in"]');
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

  @Listen('pod-os:login', { target: 'document' })
  onLogin() {
    this.openDialog();
  }

  openDialog() {
    this.dialog.showModal();
  }

  render() {
    return (
      <Host>
        <div class="container">
          {!session.state.isLoggedIn ? (
            <button id="login" onClick={() => this.openDialog()}>
              Login
            </button>
          ) : (
            this.loggedInComponents()
          )}
        </div>
        <pos-dialog ref={el => (this.dialog = el)}>
          <span slot="title">Sign in to your Pod</span>
          <pos-login-form onPod-os:idp-url-selected={ev => this.login(ev)} slot="content" />
        </pos-dialog>
      </Host>
    );
  }

  private loggedInComponents() {
    return this.customLoggedInComponent ? <slot name="if-logged-in"></slot> : this.defaultLoggedInComponents();
  }

  private defaultLoggedInComponents() {
    return [
      <pos-resource uri={session.state.webId}>
        <span class="user-data">
          <pos-picture />
          <pos-label />
        </span>
      </pos-resource>,
      <button id="logout" onClick={() => this.logout()}>
        Logout
      </button>,
    ];
  }
}
