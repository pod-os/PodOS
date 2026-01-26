import {
  Fetcher,
  graph,
  IndexedFormula,
  lit,
  st,
  sym,
  UpdateManager,
} from "rdflib";
import { PodOsSession } from "./authentication";
import { Thing } from "./thing";
import {
  executeUpdate,
  ModuleConfig,
  UpdateOperation,
} from "@solid-data-modules/rdflib-utils";
import {
  OfflineCache,
  OfflineCapableFetcher,
  NoOfflineCache,
  AssumeAlwaysOnline,
  OnlineStatus,
} from "./offline-cache";
import {
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  startWith,
  Subject,
} from "rxjs";
import { Quad } from "rdflib/lib/tf-types";

/**
 * The Store contains all data that is known locally.
 * It can be used to fetch additional data from the web and also update data and sync it back to editable resources.
 */
export class Store {
  private readonly fetcher: Fetcher;
  private readonly updater: UpdateManager;
  additions$: Subject<Quad>;
  removals$: Subject<Quad>;

  constructor(
    session: PodOsSession,
    offlineCache: OfflineCache = new NoOfflineCache(),
    onlineStatus: OnlineStatus = new AssumeAlwaysOnline(),
    private readonly internalStore: IndexedFormula = graph(),
  ) {
    this.fetcher = new OfflineCapableFetcher(this.internalStore, {
      fetch: session.authenticatedFetch,
      offlineCache,
      isOnline: onlineStatus.isOnline,
    });
    this.updater = new UpdateManager(this.internalStore);
    this.additions$ = new Subject<Quad>();
    this.removals$ = new Subject<Quad>();
    this.internalStore.addDataCallback((quad) => this.additions$.next(quad));
    this.internalStore.addDataRemovalCallback((quad) =>
      this.removals$.next(quad),
    );
  }

  /**
   * Fetch data for the given URI to the internalStore
   * @param uri
   */
  fetch(uri: string) {
    return this.fetcher.load(sym(uri), {
      // force fetching due to
      // https://github.com/linkeddata/rdflib.js/issues/247
      // and
      // https://github.com/linkeddata/rdflib.js/issues/441
      force: true,
      // explicitly omit credentials due to
      // https://github.com/pod-os/PodOS/issues/17
      credentials: "omit",
    });
  }

  /**
   * Fetch all the given URIs in parallel and put the data to the internalStore
   * @param uris
   */
  fetchAll(uris: string[]) {
    const responses = uris.map((uri) => this.fetch(uri));
    return Promise.allSettled(responses);
  }

  /**
   * Retrieve the thing identified by the given URI from the internalStore
   * @param uri
   */
  get(uri: string) {
    const editable = !!this.updater.editable(uri);
    return new Thing(uri, this.internalStore, this, editable);
  }

  /**
   * Adds a new value to the property of the given thing
   * @param thing
   * @param property
   * @param value
   */
  addPropertyValue(
    thing: Thing,
    property: string,
    value: string,
  ): Promise<void> {
    return this.updater.update(
      [],
      [st(sym(thing.uri), sym(property), lit(value), sym(thing.uri).doc())],
      undefined,
      false,
      {
        // explicitly omit credentials due to
        // https://github.com/pod-os/PodOS/issues/17
        credentials: "omit",
      },
    ) as Promise<void>; // without passing callback updater returns a Promise;
  }

  async addNewThing(uri: string, name: string, type: string): Promise<void> {
    await this.updater.update(
      [],
      [
        st(
          sym(uri),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym(type),
          sym(uri).doc(),
        ),
        st(
          sym(uri),
          sym("http://www.w3.org/2000/01/rdf-schema#label"),
          lit(name),
          sym(uri).doc(),
        ),
      ],
      undefined,
      false,
      {
        // explicitly omit credentials due to
        // https://github.com/pod-os/PodOS/issues/17
        credentials: "omit",
      },
    );
  }

  async executeUpdate(operation: UpdateOperation) {
    await executeUpdate(this.fetcher, this.updater, operation);
  }

  flagAuthorizationMetadata() {
    this.updater.flagAuthorizationMetadata();
  }

  loadModule<T>(module: PodOsModule<T>) {
    return new module.default({
      store: this.internalStore,
      fetcher: this.fetcher,
      updater: this.updater,
    });
  }

  /**
   * Finds instances of the given class or its sub-classes
   * @param {string} classUri
   * @returns {string[]} An array of URIs
   */
  findMembers(classUri: string): string[] {
    return Object.keys(this.internalStore.findMemberURIs(sym(classUri)));
  }

  /**
   * Get an Observable that will push new results from {@link findMembers} when it changes
   * @param {string} classUri
   * @returns {Observable<string[]>} Observable that pushes an array of URIs of instances of the given class or its sub-classes
   */
  observeFindMembers(classUri: string): Observable<string[]> {
    return merge(this.additions$, this.removals$).pipe(
      filter(
        (quad) =>
          quad.predicate.value ==
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" ||
          quad.predicate.value ==
            "http://www.w3.org/2000/01/rdf-schema#subClassOf",
      ),
      map(() => this.findMembers(classUri)),
      startWith(this.findMembers(classUri)),
      distinctUntilChanged((prev, curr) => prev.length == curr.length),
    );
  }

  /**
   * Determines whether a dataset includes a certain quad, returning true or false as appropriate.
   *
   * Implements https://rdf.js.org/dataset-spec/#dom-datasetcore-has
   * @param {Quad} quad
   * @returns {Boolean} Whether store's dataset includes the quad
   */
  has(quad: Quad): Boolean {
    return this.internalStore.holdsStatement(quad);
  }
}

export interface PodOsModule<T> {
  readonly default: new (config: ModuleConfig) => T;
}
