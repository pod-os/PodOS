import {
  EVENTS,
  ISessionInfo,
  Session,
} from "@inrupt/solid-client-authn-browser";
import { IHandleIncomingRedirectOptions } from "@inrupt/solid-client-authn-browser/src/Session";
import { BehaviorSubject } from "rxjs";
import { observeSession } from "./observeSession";

export type AuthenticatedFetch = (
  url: RequestInfo,
  init?: RequestInit | undefined,
) => Promise<Response>;

export type SessionInfo = ISessionInfo;

export interface PodOsSession {
  authenticatedFetch: AuthenticatedFetch;
}

export class BrowserSession implements PodOsSession {
  private readonly session: Session;
  private readonly _authenticatedFetch: AuthenticatedFetch;

  private readonly sessionInfo$: BehaviorSubject<SessionInfo>;

  get authenticatedFetch(): (
    url: RequestInfo,
    init?: RequestInit | undefined,
  ) => Promise<Response> {
    return this._authenticatedFetch;
  }

  constructor() {
    this.session = new Session();
    this.sessionInfo$ = observeSession(this.session);
    this._authenticatedFetch = this.session.fetch;
  }

  async handleIncomingRedirect(restorePreviousSession = false) {
    return this.session.handleIncomingRedirect({
      restorePreviousSession,
    });
  }

  async login(oidcIssuer: string) {
    return this.session.login({
      oidcIssuer,
      redirectUrl: window.location.href,
      clientName: `Pod OS at ${window.location.host}`,
    });
  }

  async logout() {
    return this.session.logout();
  }

  /**
   * @deprecated use observeSession instead
   */
  trackSession(callback: (session: SessionInfo) => unknown) {
    this.session.on(EVENTS.LOGIN, () => callback(this.session.info));
    this.session.on(EVENTS.LOGOUT, () => callback(this.session.info));
    this.session.on(EVENTS.SESSION_RESTORED, () => callback(this.session.info));
    callback(this.session.info);
  }

  observeSession(): BehaviorSubject<SessionInfo> {
    return this.sessionInfo$;
  }

  onSessionRestore(callback: (url: string) => void) {
    this.session.on(EVENTS.SESSION_RESTORED, callback);
  }
}
