import {
  Fetcher,
  fetcher,
  graph,
  IndexedFormula,
  lit,
  st,
  sym,
  UpdateManager,
} from "rdflib";
import { PodOsSession } from "./authentication";
import { Thing } from "./thing";

/**
 * The store contains all data that is known locally.
 * It can be used to fetch additional data from the web and also update data and sync it back to editable resources.
 */
export class Store {
  fetcher: Fetcher;
  updater: UpdateManager;
  graph: IndexedFormula;
  constructor(session: PodOsSession) {
    this.graph = graph();
    this.fetcher = fetcher(this.graph, { fetch: session.authenticatedFetch });
    this.updater = new UpdateManager(this.graph);
  }

  /**
   * Fetch data for the given URI to the store
   * @param uri
   */
  fetch(uri: string) {
    // force fetching due to
    // https://github.com/linkeddata/rdflib.js/issues/247
    // and
    // https://github.com/linkeddata/rdflib.js/issues/441
    return this.fetcher.load(sym(uri), { force: true });
  }

  /**
   * Retrieve the thing identified by the given URI from the store
   * @param uri
   */
  get(uri: string) {
    const editable = !!this.updater.editable(uri);
    return new Thing(uri, this.graph, editable);
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
    value: string
  ): Promise<void> {
    return this.updater.update(
      [],
      [st(sym(thing.uri), sym(property), lit(value), sym(thing.uri).doc())]
    ) as Promise<void>; // without passing callback updater returns a Promise;
  }
}
