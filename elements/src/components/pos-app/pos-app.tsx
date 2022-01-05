import { Component, h, Listen, State } from '@stencil/core';
import session from '../../store/session';
import { createPodOS } from '../../pod-os';

interface ConsumeOsEvent extends CustomEvent {
  detail: Function;
}

@Component({
  tag: 'pos-app',
})
export class PosApp {
  @State() os: any;

  componentWillLoad() {
    this.os = createPodOS();
    this.os.handleIncomingRedirect();
    this.os.trackSession(sessionInfo => {
      session.state.isLoggedIn = sessionInfo.isLoggedIn;
      session.state.webId = sessionInfo.webId;
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
