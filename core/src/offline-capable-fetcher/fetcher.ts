import { Fetcher, IndexedFormula, NamedNode } from "rdflib";
import { Options } from "rdflib/lib/fetcher";

export class OfflineCapableFetcher extends Fetcher {
  constructor(store: IndexedFormula, options: object) {
    super(store, options);
  }

  load<T extends NamedNode | string | Array<string | NamedNode>>(
    uri: T,
    options?: Options,
  ) {
    console.log(`Offline capable loading!!!`);
    return super.load(uri, options);
  }
}
