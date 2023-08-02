import { PodOS } from '@pod-os/core';
import { Component, h, Listen, State } from '@stencil/core';
import session from '../../store/session';
import { createPodOS } from '../../pod-os';

interface InitializeOsEvent extends CustomEvent {
  detail: Function;
}

@Component({
  tag: 'pos-app',
})
export class PosApp {
  @State() os: PodOS;

  componentWillLoad() {
    this.os = createPodOS();
    this.os.handleIncomingRedirect();
    this.os.trackSession(async sessionInfo => {
      session.state.isLoggedIn = sessionInfo.isLoggedIn;
      session.state.webId = sessionInfo.webId;
      if (sessionInfo.isLoggedIn) {
        await this.os.loadPreferences(sessionInfo.webId);
      }
    });
  }

  @Listen('pod-os:init')
  async initializeOs(event: InitializeOsEvent) {
    event.stopPropagation();
    event.detail(this.os);
  }

  render() {
    return <slot />;
  }
}
