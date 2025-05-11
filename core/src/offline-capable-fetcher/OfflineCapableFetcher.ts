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

  async load(
    uri: string,
    options?: Partial<AutoInitOptions>,
  ): Promise<Response>;
  async load(
    uri: NamedNode,
    options?: Partial<AutoInitOptions>,
  ): Promise<Response>;
  async load(
    uri: Array<string | NamedNode>,
    options?: Partial<AutoInitOptions>,
  ): Promise<Response[]>;
  async load<T extends NamedNode | string | Array<string | NamedNode>>(
    oneOrMoreUris: T,
    options?: object,
  ): Promise<T extends Array<string | NamedNode> ? Response[] : Response> {
    if (Array.isArray(oneOrMoreUris)) {
      // TODO test this case
      return (await super.load<Array<string | NamedNode>>(
        oneOrMoreUris,
        options,
      )) as T extends Array<string | NamedNode> ? Response[] : Response;
    }
    const node = sym(termValue(oneOrMoreUris)); // make sure we get a NamedNode
    const doc = node.doc();
    const response = await super.load(node, options);

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
    return response as T extends Array<string | NamedNode>
      ? Response[]
      : Response;
  }
}
