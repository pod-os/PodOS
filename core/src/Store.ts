import { Fetcher, fetcher, graph, IndexedFormula, sym } from "rdflib";
import { authenticatedFetch } from "./authentication";

export class Store {
  fetcher: Fetcher;
  graph: IndexedFormula;
  constructor() {
    this.graph = graph();
    this.fetcher = fetcher(this.graph, { fetch: authenticatedFetch });
  }

  fetch(uri: string) {
    return this.fetcher.load(sym(uri));
  }
}
