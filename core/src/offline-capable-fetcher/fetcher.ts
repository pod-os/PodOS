import {
  AutoInitOptions,
  Fetcher,
  IndexedFormula,
  NamedNode,
  sym,
  termValue,
} from "rdflib";
import { OfflineCache } from "./OfflineCache";

export interface OfflineCapableFetcherOptions {
  fetch: (uri: string) => Promise<Response>;
  isOnline: () => boolean;
  offlineCache: OfflineCache;
}

export class OfflineCapableFetcher extends Fetcher {
  private offlineCache: OfflineCache;
  store: IndexedFormula;
  constructor(
    store: IndexedFormula,
    options: Partial<AutoInitOptions> & OfflineCapableFetcherOptions,
  ) {
    const { offlineCache, ...rest } = options;
    super(store, rest);
    this.store = store;
    this.offlineCache = offlineCache;
  }

  async load<T extends NamedNode | string | Array<string | NamedNode>>(
    uri: T,
    options?: Partial<AutoInitOptions>,
  ) {
    const doc = sym(termValue(uri as NamedNode)).doc();
    const response = await super.load(uri, options);
    const etag = response.headers.get("etag");

    const statementsInStore = this.store.statementsMatching(
      null,
      null,
      null,
      doc,
    );

    this.offlineCache.put({
      url: doc.uri,
      revision: etag || "",
      statements: statementsInStore.map((s) => s.toNT()),
    });
    return response;
  }
}
