import { BehaviorSubject, tap } from "rxjs";
import { PodOsSession, SessionInfo } from "./authentication";
import { FileFetcher, FileGateway, SolidFile } from "./files";
import { AttachmentGateway } from "./attachments";
import { PictureGateway } from "./picture";
import { ProfileGateway, WebIdProfile } from "./profile";
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
import { ResultAsync } from "neverthrow";
import { HttpProblem, NetworkProblem } from "./problems";
import { loadModule } from "./modules";

export * from "./authentication";
export * from "./files";
export * from "./thing";
export * from "./rdf-document";
export * from "./ldp-container";
export * from "./attachments";
export * from "./picture";
export * from "./profile";
export * from "./search";
export * from "./offline-cache";
export * from "./terms";
export * from "./Store";
export * from "./uri";
export * from "./problems";
export * from "./type-index";

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
  private readonly fileGateway: FileGateway;
  private readonly attachmentGateway: AttachmentGateway;
  private readonly pictureGateway: PictureGateway;
  private readonly offlineCache: OfflineCache;
  private readonly profileGateway: ProfileGateway;

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
    this.fileFetcher = new FileFetcher(this.session);
    this.fileGateway = new FileGateway(this.store, this.fileFetcher);
    this.attachmentGateway = new AttachmentGateway(this.fileGateway);
    this.pictureGateway = new PictureGateway(this.fileGateway);
    this.flagAuthorizationMetaDataOnSessionChange();
    this.uriService = new UriService(this.store);
    this.profileGateway = new ProfileGateway(this.store);
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
    return this.profileGateway.fetchProfile(webId);
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

  /**
   * Dynamically loads a module by its name and returns an instance of the module
   * @param moduleName
   */
  loadModule<T>(moduleName: string): Promise<T> {
    return loadModule(moduleName, this.store);
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

  /**
   * Uploads a picture file and associates it with a thing.
   * The container is automatically derived from the thing's URI.
   *
   * @param thing - The thing to add the picture to
   * @param pictureFile - The picture file to upload
   * @returns Result with the picture URL or error
   */
  uploadAndAddPicture(
    thing: Thing,
    pictureFile: File,
  ): ResultAsync<{ url: string }, HttpProblem | NetworkProblem> {
    return this.pictureGateway.uploadAndAddPicture(thing, pictureFile);
  }

  /**
   * Provides access to attachment operations such as uploading and linking attachments to things
   * @since 0.24.0
   * @returns {AttachmentGateway} An instance of AttachmentGateway that handles attachment operations
   */
  attachments(): AttachmentGateway {
    return this.attachmentGateway;
  }
}
