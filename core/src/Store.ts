import {
  Fetcher,
  fetcher,
  graph,
  IndexedFormula,
  sym,
  UpdateManager,
} from "rdflib";
import { PodOsSession } from "./authentication";
import { Thing } from "./thing";

export class Store {
  fetcher: Fetcher;
  updater: UpdateManager;
  graph: IndexedFormula;
  constructor(session: PodOsSession) {
    this.graph = graph();
    this.fetcher = fetcher(this.graph, { fetch: session.authenticatedFetch });
    this.updater = new UpdateManager(this.graph);
  }

  fetch(uri: string) {
    // force fetching due to
    // https://github.com/linkeddata/rdflib.js/issues/247
    // and
    // https://github.com/linkeddata/rdflib.js/issues/441
    return this.fetcher.load(sym(uri), { force: true });
  }

  get(uri: string) {
    const editable = !!this.updater.editable(uri);
    return new Thing(uri, this.graph, editable);
  }
}
