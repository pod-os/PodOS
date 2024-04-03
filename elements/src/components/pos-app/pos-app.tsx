import { PodOS } from '@pod-os/core';
import { Component, h, Listen, State } from '@stencil/core';
import session from '../../store/session';
import { createPodOS } from '../../pod-os';

interface InitializeOsEvent extends CustomEvent {
  detail: Function;
}

interface RequestModuleEvent extends CustomEvent {
  detail: {
    module: string;
    receiver: Function;
  };
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
      session.state.webId = sessionInfo.webId;
      if (sessionInfo.isLoggedIn) {
        const profile = await this.os.fetchProfile(sessionInfo.webId);
        session.state.profile = profile;
      }
      session.state.isLoggedIn = sessionInfo.isLoggedIn;
    });
  }

  @Listen('pod-os:init')
  async initializeOs(event: InitializeOsEvent) {
    event.stopPropagation();
    event.detail(this.os);
  }

  @Listen('pod-os:module')
  async loadModule(event: RequestModuleEvent) {
    event.stopPropagation();
    const module = await this.os.loadContactsModule();
    event.detail.receiver(module);
  }

  render() {
    return <slot />;
  }
}
