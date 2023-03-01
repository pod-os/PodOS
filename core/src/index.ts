import { ISessionInfo } from "@inrupt/solid-client-authn-browser";
import { BrowserSession } from "./authentication";
import { SolidFile } from "./files";
import { FileFetcher } from "./files/FileFetcher";
import { Store } from "./Store";
import { listKnownTerms, Term } from "./terms";
import { Thing } from "./thing";

export * from "./authentication";
export * from "./files";
export * from "./thing";
export * from "./rdf-document";
export * from "./ldp-container";

export class PodOS {
  private subscriber: any = {};
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

  fetchFile(url: string): Promise<SolidFile> {
    return this.fileFetcher.fetchFile(url);
  }

  async addPropertyValue(thing: Thing, property: string, value: string) {
    await this.store.addPropertyValue(thing, property, value);
    console.log("call subscriber after change of", thing.uri, property, value);
    this.subscriber[thing.uri]();
  }

  listKnownTerms(): Term[] {
    return listKnownTerms();
  }

  subscribeChanges(uri: string, sub: () => any) {
    console.log("register subscriber for", uri);
    this.subscriber[uri] = sub;
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
