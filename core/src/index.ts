import { ISessionInfo } from "@inrupt/solid-client-authn-browser";
import { BrowserSession } from "./authentication";
import { Store } from "./Store";

export * from "./authentication";

export class PodOS {
  private readonly session: BrowserSession;
  readonly store: Store;

  constructor() {
    this.session = new BrowserSession();
    this.store = new Store(this.session);
  }

  handleIncomingRedirect() {
    this.session.handleIncomingRedirect();
  }

  fetch(uri: string) {
    return this.store.fetch(uri);
  }

  trackSession(callback: (session: ISessionInfo) => unknown) {
    return this.session.trackSession(callback);
  }

  logout() {
    return this.session.logout();
  }

  login(oidcIssuer = "http://localhost:3000") {
    return this.session.login(oidcIssuer);
  }
}
