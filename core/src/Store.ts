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
   * Fetch all the given URIs in parallel and put the data to the store
   * @param uris
   */
  fetchAll(uris: string[]) {
    const responses = uris.map((uri) => this.fetch(uri));
    return Promise.allSettled(responses);
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
}
