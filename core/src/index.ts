import { ContactsModule } from "@solid-data-modules/contacts-rdflib";
import { BehaviorSubject, tap } from "rxjs";
import { BrowserSession, SessionInfo } from "./authentication";
import { SolidFile } from "./files";
import { FileFetcher } from "./files/FileFetcher";
import { loadContactsModule } from "./modules/contacts";
import { WebIdProfile } from "./profile";
import { LabelIndex, SearchIndex } from "./search";
import { Store } from "./Store";
import { listKnownTerms, Term } from "./terms";
import { Thing } from "./thing";
import { UriService } from "./uri/UriService";
import { SearchGateway } from "./search";

export * from "./authentication";
export * from "./files";
export * from "./thing";
export * from "./rdf-document";
export * from "./ldp-container";
export * from "./profile";
export * from "./search";

export class PodOS {
  private readonly session: BrowserSession;
  readonly store: Store;
  readonly uriService: UriService;
  private fileFetcher: FileFetcher;
  private searchGateway: SearchGateway;

  constructor() {
    this.session = new BrowserSession();
    this.store = new Store(this.session);
    this.searchGateway = new SearchGateway(this.store);
    this.flagAuthorizationMetaDataOnSessionChange();
    this.uriService = new UriService(this.store);
    this.fileFetcher = new FileFetcher(this.session);
  }

  /*
     Flagging authorization metadata is necessary every time the user
     logs in or out, so that metadata from previous requests is outdated
     and not considered to determine whether a resource is editable anymore.

     See: https://github.com/linkeddata/rdflib.js/pull/512
  */
  private flagAuthorizationMetaDataOnSessionChange() {
    this.session
      .observeSession()
      .pipe(
        tap(() => {
          this.store.updater.flagAuthorizationMetadata();
        }),
      )
      .subscribe();
  }

  handleIncomingRedirect(restorePreviousSession = false) {
    this.session.handleIncomingRedirect(restorePreviousSession);
  }

  fetch(uri: string) {
    return this.store.fetch(uri);
  }

  fetchAll(uris: string[]) {
    return this.store.fetchAll(uris);
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

  /**
   * @deprecated use observeSession instead
   * @param callback
   */
  trackSession(callback: (session: SessionInfo) => unknown): void {
    return this.session.trackSession((session) => {
      callback(session);
    });
  }

  /**
   * returns a behavior subject that can be used to observe changes in the session state
   */
  observeSession(): BehaviorSubject<SessionInfo> {
    return this.session.observeSession();
  }

  /**
   * Calls the provided callback with the original URL that was open before the silent auth redirect
   * @param callback
   */
  onSessionRestore(callback: (url: string) => unknown): void {
    this.session.onSessionRestore(callback);
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
    const labelIndexUris = profile.getPrivateLabelIndexes();
    if (labelIndexUris.length > 0) {
      await this.fetchAll(labelIndexUris);
      const labelIndex = labelIndexUris.map((uri) =>
        this.store.get(uri).assume(LabelIndex),
      );
      return new SearchIndex(labelIndex);
    }
    return new SearchIndex([]);
  }

  logout() {
    return this.session.logout();
  }

  login(oidcIssuer = "http://localhost:3000") {
    return this.session.login(oidcIssuer);
  }

  loadContactsModule(): Promise<ContactsModule> {
    return loadContactsModule(this.store);
  }

  /**
   * Adds a label of the given thing to the label index, so that it can be found after the search index has been rebuilt
   * @param thing - The thing to index
   * @param labelIndex - The index to update
   */
  async addToLabelIndex(thing: Thing, labelIndex: LabelIndex) {
    await this.searchGateway.addToLabelIndex(thing, labelIndex);
  }

  /**
   * Creates a new label index document at a default location and links it to the user's profile or preferences document
   *
   * @param profile - The profile for that to create the index
   * @returns the newly created label index
   */
  async createDefaultLabelIndex(profile: WebIdProfile): Promise<LabelIndex> {
    return await this.searchGateway.createDefaultLabelIndex(profile);
  }
}
