import { Fetcher, fetcher, graph, IndexedFormula, sym } from "rdflib";
import { BrowserSession } from "./authentication";
import { Thing } from "./Thing";

export class Store {
  fetcher: Fetcher;
  graph: IndexedFormula;
  constructor(session: BrowserSession) {
    this.graph = graph();
    this.fetcher = fetcher(this.graph, { fetch: session.authenticatedFetch });
  }

  fetch(uri: string) {
    return this.fetcher.load(sym(uri));
  }

  get(uri: string) {
    return new Thing(uri, this.graph);
  }
}
