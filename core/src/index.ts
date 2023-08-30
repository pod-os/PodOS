import { ISessionInfo } from "@inrupt/solid-client-authn-browser";
import { BrowserSession } from "./authentication";
import { SolidFile } from "./files";
import { FileFetcher } from "./files/FileFetcher";
import { WebIdProfile } from "./profile";
import { LabelIndex } from "./search/LabelIndex";
import { SearchIndex } from "./search/SearchIndex";
import { Store } from "./Store";
import { listKnownTerms, Term } from "./terms";
import { Thing } from "./thing";
import { UriService } from "./uri/UriService";

export * from "./authentication";
export * from "./files";
export * from "./thing";
export * from "./rdf-document";
export * from "./ldp-container";
export * from "./profile";

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
    value: string,
  ): Promise<void> {
    return this.store.addPropertyValue(thing, property, value);
  }

  listKnownTerms(): Term[] {
    return listKnownTerms();
  }

  addNewThing(uri: string, name: string, type: string): Promise<void> {
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

  /**
   * Fetch the WebId profile and preferences file for the given WebID
   * @param webId
   */
  async fetchProfile(webId: string) {
    await this.fetch(webId);
    const profile: WebIdProfile = this.store.get(webId).assume(WebIdProfile);
    const preferences = profile.getPreferencesFile();
    if (preferences) {
      await this.fetch(preferences);
    }
    return profile;
  }

  /**
   * Fetch the private label index for the given profile and build a search index from it
   * @param webId
   */
  async buildSearchIndex(profile: WebIdProfile) {
    const labelIndexUri = profile.getPrivateLabelIndex();
    const indexes = [];
    if (labelIndexUri) {
      await this.fetch(labelIndexUri);
      const labelIndex = this.store.get(labelIndexUri).assume(LabelIndex);
      indexes.push(labelIndex);
    }
    return new SearchIndex(indexes);
  }

  logout() {
    return this.session.logout();
  }

  login(oidcIssuer = "http://localhost:3000") {
    return this.session.login(oidcIssuer);
  }
}
