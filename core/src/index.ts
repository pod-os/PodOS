import { ISessionInfo } from "@inrupt/solid-client-authn-browser";
import { BrowserSession } from "./authentication";
import { SolidFile } from "./files";
import { FileFetcher } from "./files/FileFetcher";
import { Store } from "./Store";
import { listKnownTerms, Term } from "./terms";
import { Thing } from "./thing";
import { UriService } from "./uri/UriService";

export * from "./authentication";
export * from "./files";
export * from "./thing";
export * from "./rdf-document";
export * from "./ldp-container";

export class PodOS {
  private readonly session: BrowserSession;
  readonly store: Store;
  readonly uriService: UriService;
  private fileFetcher: FileFetcher;

  constructor() {
    this.session = new BrowserSession();
    this.store = new Store(this.session);
    this.uriService = new UriService(this.store);
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

  addPropertyValue(
    thing: Thing,
    property: string,
    value: string
  ): Promise<void> {
    return this.store.addPropertyValue(thing, property, value);
  }

  listKnownTerms(): Term[] {
    return listKnownTerms();
  }

  addNewThing(uri: string, name: string, type: string) {
    return this.store.addNewThing(uri, name, type);
  }

  proposeUriForNewThing(referenceUri: string, name: string) {
    return this.uriService.proposeUriForNewThing(referenceUri, name);
  }

  trackSession(callback: (session: ISessionInfo) => unknown): void {
    return this.session.trackSession((session) => {
      /*
         Flagging authorization metadata is necessary every time the user
         logs in or out, so that metadata from previous requests is outdated
         and not considered to determine whether a resource is editable anymore.

         See: https://github.com/linkeddata/rdflib.js/pull/512
       */
      this.store.updater.flagAuthorizationMetadata();
      callback(session);
    });
  }

  logout() {
    return this.session.logout();
  }

  login(oidcIssuer = "http://localhost:3000") {
    return this.session.login(oidcIssuer);
  }
}
