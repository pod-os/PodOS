import { Component, h, Listen, State } from '@stencil/core';
import state from '../../store/session';

interface ConsumeOsEvent extends CustomEvent {
  detail: Function;
}

@Component({
  tag: 'pos-app',
})
export class PosApp {
  @State() os: any;

  componentWillLoad() {
    // @ts-ignore
    this.os = window.PodOS ? new window.PodOS.PodOS() : null;
    this.os.handleIncomingRedirect();
    this.os.trackSession(sessionInfo => {
      state.isLoggedIn = sessionInfo.isLoggedIn;
      state.webId = sessionInfo.webId;
    });
  }

  @Listen('consumeOs')
  async consumeOs(event: ConsumeOsEvent) {
    event.stopPropagation();
    event.detail(this.os);
  }

  render() {
    return (
      <ion-app>
        <slot />
      </ion-app>
    );
  }
}
