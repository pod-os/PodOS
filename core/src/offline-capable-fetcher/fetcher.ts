import { AutoInitOptions, Fetcher, IndexedFormula, NamedNode } from "rdflib";
import { OfflineCache } from "./OfflineCache";

export interface OfflineCapableFetcherOptions {
  fetch: (uri: string) => Promise<Response>;
  isOnline: () => boolean;
  offlineCache: OfflineCache;
}

export class OfflineCapableFetcher extends Fetcher {
  constructor(
    store: IndexedFormula,
    options: Partial<AutoInitOptions> & OfflineCapableFetcherOptions,
  ) {
    super(store, options);
  }

  load<T extends NamedNode | string | Array<string | NamedNode>>(
    uri: T,
    options?: Partial<AutoInitOptions>,
  ) {
    console.log(`Offline capable loading!!!`);

    return super.load(uri, options);
  }
}
