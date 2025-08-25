import { PodOS } from '@pod-os/core';
import { Component, h, Listen, Prop, State, Event, EventEmitter } from '@stencil/core';
import sessionStore from '../../store/session';
import { localSettings } from '../../store/settings';
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
  shadow: true,
})
export class PosApp {
  @State() os: PodOS;

  @Prop() restorePreviousSession: boolean = false;

  /**
   * Fired whenever the session was restored
   */
  @Event({ eventName: 'pod-os:session-restored' }) sessionRestoredEmitter: EventEmitter<{ url: string }>;

  private readonly disconnected$ = new Subject<void>();

  @State()
  private unsubscribeSettings: () => void;

  @State()
  private loading = true;

  async componentWillLoad() {
    this.unsubscribeSettings = localSettings.on('set', () => {
      this.os = createPodOS(localSettings.state);
    });
    this.os = createPodOS(localSettings.state);
    this.os.onSessionRestore(url => {
      this.sessionRestoredEmitter.emit({ url });
    });
    try {
      await this.os.handleIncomingRedirect(this.restorePreviousSession);
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
    if (event.detail.module === 'contacts') {
      const module = await this.os.loadContactsModule();
      event.detail.receiver(module);
    } else {
      throw Error(`Unknown module "${event.detail.module}"`);
    }
  }

  render() {
    return this.loading ? <ion-progress-bar type="indeterminate"></ion-progress-bar> : <slot></slot>;
  }
}
