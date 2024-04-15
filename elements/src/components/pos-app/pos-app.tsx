import { PodOS, WebIdProfile, AuthenticatedFetch } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Listen, State } from '@stencil/core';
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

interface LoginEvent {
  isLoggedIn: true;
  webId: string;
  profile: WebIdProfile;
  authenticatedFetch: AuthenticatedFetch;
}

interface LogoutEvent {
  isLoggedIn: false;
}

@Component({
  tag: 'pos-app',
})
export class PosApp {
  @State() os: PodOS;

  /**
   * Fired whenever the session login state changes (login / logout)
   */
  @Event({ eventName: 'pod-os:session-changed' }) sessionChangedEmitter: EventEmitter<LoginEvent | LogoutEvent>;

  /**
   * Fires after a user has been authenticated successfully
   */
  @Event({ eventName: 'pod-os:login' }) loginEmitter: EventEmitter<LoginEvent>;

  /**
   * Fires after a user signed out
   */
  @Event({ eventName: 'pod-os:logout' }) logoutEmitter: EventEmitter<LogoutEvent>;

  componentWillLoad() {
    this.os = createPodOS();
    this.os.handleIncomingRedirect();
    this.os.trackSession(async (sessionInfo, authenticatedFetch) => {
      session.state.webId = sessionInfo.webId;
      if (sessionInfo.isLoggedIn) {
        const profile = await this.os.fetchProfile(sessionInfo.webId);
        session.state.profile = profile;
        this.sessionChangedEmitter.emit({
          isLoggedIn: true,
          webId: sessionInfo.webId,
          profile: session.state.profile,
          authenticatedFetch,
        });
        this.loginEmitter.emit({
          isLoggedIn: sessionInfo.isLoggedIn,
          webId: sessionInfo.webId,
          profile: session.state.profile,
          authenticatedFetch,
        });
      } else {
        this.sessionChangedEmitter.emit({
          isLoggedIn: false,
        });
        this.logoutEmitter.emit({
          isLoggedIn: false,
        });
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
    if (event.detail.module === 'contacts') {
      const module = await this.os.loadContactsModule();
      event.detail.receiver(module);
    } else {
      throw Error(`Unknown module "${event.detail.module}"`);
    }
  }

  render() {
    return <slot />;
  }
}
