import { Session } from "@uvdsl/solid-oidc-client-browser";
import { BehaviorSubject } from "rxjs";

export type AuthenticatedFetch = (
  url: RequestInfo,
  init?: RequestInit | undefined,
) => Promise<Response>;

export type SessionInfo = {
  isLoggedIn: boolean;
  webId?: string;
};

export interface PodOsSession {
  authenticatedFetch: AuthenticatedFetch;
}

export class BrowserSession implements PodOsSession {
  private readonly session: Session;
  private onSessionRestoreCallback: (url: string) => void = () => {};
  private readonly _authenticatedFetch: AuthenticatedFetch;

  private readonly sessionInfo$: BehaviorSubject<SessionInfo> =
    new BehaviorSubject<SessionInfo>({
      isLoggedIn: false,
      webId: undefined,
    });

  get authenticatedFetch(): (
    url: RequestInfo,
    init?: RequestInit | undefined,
  ) => Promise<Response> {
    return this._authenticatedFetch;
  }

  constructor() {
    this.session = new Session();
    this._authenticatedFetch = this.session.authFetch.bind(this.session);
  }

  async handleIncomingRedirect(restorePreviousSession = false) {
    await this.session.handleRedirectFromLogin();
    if (restorePreviousSession) {
      await this.session.restore();
      if (this.session.isActive) {
        this.onSessionRestoreCallback(window.location.href);
      }
    }
    this.sessionInfo$.next({
      isLoggedIn: this.session.isActive,
      webId: this.session.webId,
    });
  }

  async login(oidcIssuer: string) {
    return this.session.login(oidcIssuer, window.location.href);
  }

  async logout() {
    await this.session.logout();
    this.sessionInfo$.next({
      isLoggedIn: false,
      webId: undefined,
    });
  }

  observeSession(): BehaviorSubject<SessionInfo> {
    return this.sessionInfo$;
  }

  onSessionRestore(callback: (url: string) => void) {
    this.onSessionRestoreCallback = callback;
  }
}
