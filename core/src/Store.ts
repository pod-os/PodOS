import { Fetcher, fetcher, graph, IndexedFormula, sym } from "rdflib";
import { BrowserSession } from "./authentication";
import { Thing } from "./thing";

export class Store {
  fetcher: Fetcher;
  graph: IndexedFormula;
  constructor(session: BrowserSession) {
    this.graph = graph();
    this.fetcher = fetcher(this.graph, { fetch: session.authenticatedFetch });
  }

  fetch(uri: string) {
    // force fetching due to
    // https://github.com/linkeddata/rdflib.js/issues/247
    // and
    // https://github.com/linkeddata/rdflib.js/issues/441
    return this.fetcher.load(sym(uri), { force: true });
  }

  get(uri: string) {
    return new Thing(uri, this.graph);
  }
}
