import { ContactsModule } from "@solid-data-modules/contacts-rdflib";
import { BehaviorSubject, tap } from "rxjs";
import { SessionInfo, PodOsSession } from "./authentication";
import { SolidFile } from "./files";
import { FileFetcher } from "./files/FileFetcher";
import { loadContactsModule } from "./modules/contacts";
import { WebIdProfile } from "./profile";
import { LabelIndex, SearchGateway } from "./search";
import { Store } from "./Store";
import { listKnownTerms, Term } from "./terms";
import { Thing } from "./thing";
import { UriService } from "./uri/UriService";
import {
  AssumeAlwaysOnline,
  NoOfflineCache,
  OfflineCache,
  OnlineStatus,
} from "./offline-cache";
import { IndexedFormula } from "rdflib";
import { LdpContainer } from "../types";

export * from "./authentication";
export * from "./files";
export * from "./thing";
export * from "./rdf-document";
export * from "./ldp-container";
export * from "./profile";
export * from "./search";
export * from "./offline-cache";
export * from "./terms";
export * from "./Store";
export * from "./uri";

export interface PodOsConfiguration {
  offlineCache?: OfflineCache;
  onlineStatus?: OnlineStatus;
  session?: PodOsSession;
  internalStore?: IndexedFormula;
}

export class PodOS {
  private readonly session: PodOsSession;
  readonly store: Store;
  readonly uriService: UriService;
  private readonly fileFetcher: FileFetcher;
  private readonly searchGateway: SearchGateway;
  private readonly offlineCache: OfflineCache;

  constructor({
    session = {} as PodOsSession,
    offlineCache = new NoOfflineCache(),
    onlineStatus = new AssumeAlwaysOnline(),
    internalStore = undefined,
  }: PodOsConfiguration = {}) {
    this.session = session;
    this.offlineCache = offlineCache;
    this.store = new Store(
      this.session,
      offlineCache,
      onlineStatus,
      internalStore,
    );
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
          this.store.flagAuthorizationMetadata();
        }),
      )
      .subscribe();
  }

  fetch(uri: string) {
    return this.store.fetch(uri);
  }

  fetchAll(uris: string[]) {
    return this.store.fetchAll(uris);
  }

  /**
   * @deprecated Use {@link FileFetcher.fetchFile} via {@link PodOS.files} instead
   * @param {string} url - URL identifying the file
   * @returns {Promise<SolidFile>} An object representing the fetched file
   */
  fetchFile(url: string): Promise<SolidFile> {
    return this.files().fetchFile(url);
  }

  /**
   * Provides access to file operations such as fetching and updating files in the pod
   * @returns {FileFetcher} An instance of FileFetcher that handles file operations
   */
  files(): FileFetcher {
    return this.fileFetcher;
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

  async createNewFile(container: LdpContainer, name: string) {
    console.log("TODO createNewFile", container, name);
  }

  async createNewFolder(container: LdpContainer, name: string) {
    console.log("TODO createNewFolder", container, name);
  }

  /**
   * returns a behavior subject that can be used to observe changes in the session state
   */
  observeSession(): BehaviorSubject<SessionInfo> {
    return this.session.observeSession();
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
   * @param profile
   */
  async buildSearchIndex(profile: WebIdProfile) {
    return this.searchGateway.buildSearchIndex(profile);
  }

  logout() {
    this.offlineCache.clear();
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
