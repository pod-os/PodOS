import { PodOS } from '@pod-os/core';
import { Component, h, Listen, Prop, State, Event, EventEmitter } from '@stencil/core';
import sessionStore from '../../store/session';
import { localSettings } from '../../store/settings';
import { createPodOS } from '../../pod-os';
import { Subject, takeUntil } from 'rxjs';
import { BrowserSession } from '../../authentication';

import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js';

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
  shadow: true,
})
export class PosApp {
  @State() os: PodOS;

  @Prop() restorePreviousSession: boolean = false;

  /**
   * Fired whenever the session was restored
   */
  @Event({ eventName: 'pod-os:session-restored' }) sessionRestoredEmitter: EventEmitter<{ url: string }>;

  /**
   * Fires as soon as the pos-app DOM element has been loaded and PodOS can be used. Note: In case the user is authenticated, this will fire before profile data of the user has been fetched, but after authentication has been handled.
   */
  @Event({ eventName: 'pod-os:loaded' }) podOsLoadedEmitter: EventEmitter<{
    os: PodOS;
    authenticatedFetch: typeof globalThis.fetch;
  }>;

  private readonly disconnected$ = new Subject<void>();

  @State()
  private unsubscribeSettings: () => void;

  @State()
  private loading = true;

  async componentWillLoad() {
    const session = new BrowserSession();
    this.unsubscribeSettings = localSettings.on('set', () => {
      this.os = createPodOS(session, localSettings.state);
    });
    this.os = createPodOS(session, localSettings.state);
    session.onSessionRestore(url => {
      this.sessionRestoredEmitter.emit({ url });
    });
    try {
      await session.handleIncomingRedirect(this.restorePreviousSession);
    } catch (e) {
      console.error(e);
    }
    this.os
      .observeSession()
      .pipe(takeUntil(this.disconnected$))
      .subscribe(async sessionInfo => {
        sessionStore.state.webId = sessionInfo.webId;
        if (sessionInfo.isLoggedIn) {
          const profile = await this.os.fetchProfile(sessionInfo.webId);
          sessionStore.state.profile = profile;
        }
        sessionStore.state.isLoggedIn = sessionInfo.isLoggedIn;
        this.loading = false;
      });
    this.podOsLoadedEmitter.emit({
      os: this.os,
      authenticatedFetch: session.authenticatedFetch,
    });
  }

  disconnectedCallback() {
    this.unsubscribeSettings();
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
    const module = await this.os.loadModule(event.detail.module);
    event.detail.receiver(module);
  }

  render() {
    return this.loading ? <sl-progress-bar indeterminate></sl-progress-bar> : <slot></slot>;
  }
}
