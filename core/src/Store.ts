import { Fetcher, IndexedFormula, lit, st, sym, UpdateManager } from "rdflib";
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
  Observable,
  startWith,
  Subject,
  takeUntil,
} from "rxjs";
import { Quad } from "rdflib/lib/tf-types";

interface ObservableIndexedFormula extends IndexedFormula {
  additions$: Subject<Quad>;
  removals$: Subject<Quad>;
}

/**
 * Creates a new rdflib.js graph where changes to statements are observable through rxjs Subjects additions$ and removals$
 */
export function observableGraph(): ObservableIndexedFormula {
  const additions$ = new Subject<Quad>();
  // We keep distinct values only because rdfArrayRemove is called 5 times with the same quad - once for each index + once for the statement
  const removals$ = new Subject<Quad>().pipe(
    distinctUntilChanged(),
  ) as Subject<Quad>;
  const internalStore = new IndexedFormula(
    // FeaturesType is not exported from rdflib
    {} as any,
    {
      dataCallback: (quad) => additions$.next(quad),
      // Because of the structure of IndexedFormula, the matching logic needs to be reimplemented in order to insert the callback
      //https://github.com/linkeddata/rdflib.js/blob/c049d599d6c03905283fb28f31de6389c7d18eb8/src/utils-js.js#L272
      rdfArrayRemove: (statements: Quad[], quad: Quad) => {
        for (var i = 0; i < statements.length; i++) {
          if (
            statements[i].subject.equals(quad.subject) &&
            statements[i].predicate.equals(quad.predicate) &&
            statements[i].object.equals(quad.object) &&
            statements[i].graph.equals(quad.graph)
          ) {
            //console.log(quad)
            statements.splice(i, 1);
            removals$.next(quad);
            return;
          }
        }
        throw new Error(
          "RDFArrayRemove: Array did not contain " + quad + " " + quad.graph,
        );
      },
    },
  ) as ObservableIndexedFormula;
  internalStore.additions$ = additions$;
  internalStore.removals$ = removals$;
  return internalStore;
}

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
    // We support IndexedFormula as well as ObservableIndexedFormula in case the user does not need store reactivity
    private readonly internalStore:
      | IndexedFormula
      | ObservableIndexedFormula = observableGraph(),
  ) {
    this.fetcher = new OfflineCapableFetcher(this.internalStore, {
      fetch: session.authenticatedFetch,
      offlineCache,
      isOnline: onlineStatus.isOnline,
    });
    this.updater = new UpdateManager(this.internalStore);
    this.additions$ =
      "additions$" in internalStore
        ? internalStore.additions$
        : new Subject<Quad>();
    this.removals$ =
      "removals$" in internalStore
        ? internalStore.removals$
        : new Subject<Quad>();
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
    return new Thing(uri, this.internalStore, editable);
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

  /**
   * Finds instances of the given class or its sub-classes
   * @param classUri
   */
  findMembers(classUri: string): string[] {
    return Object.keys(this.internalStore.findMemberURIs(sym(classUri)));
  }

  observeFindMembers(
    classUri: string,
    stop$: Subject<void>,
  ): Observable<string[]> {
    return this.additions$.pipe(
      takeUntil(stop$),
      filter(
        (quad) =>
          quad.predicate.value ==
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      ),
      map(() => this.findMembers(classUri)),
      distinctUntilChanged((prev, curr) => prev.length == curr.length),
      startWith(this.findMembers(classUri)),
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
}

interface PodOsModule<T> {
  readonly default: new (config: ModuleConfig) => T;
}
