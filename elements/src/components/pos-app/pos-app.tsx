import { PodOS } from '@pod-os/core';
import { Component, h, Listen, Prop, State, Event, EventEmitter } from '@stencil/core';
import session from '../../store/session';
import { createPodOS } from '../../pod-os';
import { Subject, takeUntil } from 'rxjs';

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

  @Prop() restorePreviousSession: boolean = false;

  /**
   * Fired whenever the session was restored
   */
  @Event({ eventName: 'pod-os:session-restored' }) sessionRestoredEmitter: EventEmitter<{ url: string }>;

  private readonly disconnected$ = new Subject<void>();

  componentWillLoad() {
    this.os = createPodOS();
    this.os.onSessionRestore(url => {
      this.sessionRestoredEmitter.emit({ url });
    });
    this.os.handleIncomingRedirect(this.restorePreviousSession);
    this.os
      .observeSession()
      .pipe(takeUntil(this.disconnected$))
      .subscribe(async sessionInfo => {
        session.state.webId = sessionInfo.webId;
        if (sessionInfo.isLoggedIn) {
          const profile = await this.os.fetchProfile(sessionInfo.webId);
          session.state.profile = profile;
        }
        session.state.isLoggedIn = sessionInfo.isLoggedIn;
      });
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.unsubscribe();
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
