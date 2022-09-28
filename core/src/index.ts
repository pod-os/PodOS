import { ISessionInfo } from "@inrupt/solid-client-authn-browser";
import { BrowserSession } from "./authentication";
import { FileFetcher } from "./files/FileFetcher";
import { Store } from "./Store";

export * from "./authentication";

export class PodOS {
  private readonly session: BrowserSession;
  readonly store: Store;
  private fileFetcher: FileFetcher;

  constructor() {
    this.session = new BrowserSession();
    this.store = new Store(this.session);
    this.fileFetcher = new FileFetcher(this.session);
  }

  handleIncomingRedirect() {
    this.session.handleIncomingRedirect();
  }

  fetch(uri: string) {
    return this.store.fetch(uri);
  }

  fetchBlob(url: string): Promise<Blob> {
    return this.fileFetcher.fetchBlob(url);
  }

  trackSession(callback: (session: ISessionInfo) => unknown): void {
    return this.session.trackSession(callback);
  }

  logout() {
    return this.session.logout();
  }

  login(oidcIssuer = "http://localhost:3000") {
    return this.session.login(oidcIssuer);
  }
}
