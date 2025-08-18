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

export * from "./BrowserSession";