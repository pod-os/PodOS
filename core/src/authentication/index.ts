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
  observeSession: () => BehaviorSubject<SessionInfo>;
  login: (oidcIssuer: string) => Promise<void>;
  logout: () => Promise<void>;
}

export class AnonymousSession implements PodOsSession {
  private readonly sessionInfo$: BehaviorSubject<SessionInfo> =
    new BehaviorSubject<SessionInfo>({
      isLoggedIn: false,
      webId: undefined,
    });

  get authenticatedFetch(): (
    url: RequestInfo,
    init?: RequestInit | undefined,
  ) => Promise<Response> {
    return global.fetch;
  }

  observeSession() {
    return this.sessionInfo$;
  }

  login(): Promise<void> {
    return Promise.resolve();
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }
}
