import {
  AutoInitOptions,
  Fetcher,
  FetchError,
  IndexedFormula,
  NamedNode,
  parse,
  serialize,
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
  private readonly offlineCache: OfflineCache;
  private readonly isOnline: () => boolean;
  private readonly store: IndexedFormula;

  constructor(
    store: IndexedFormula,
    options: Partial<AutoInitOptions> & OfflineCapableFetcherOptions,
  ) {
    const { offlineCache, isOnline, ...rest } = options;
    super(store, rest);
    this.store = store;
    this.offlineCache = offlineCache;
    this.isOnline = isOnline;
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
      return (await super.load<Array<string | NamedNode>>(
        oneOrMoreUris,
        options,
      )) as T extends Array<string | NamedNode> ? Response[] : Response;
    }

    const node = sym(termValue(oneOrMoreUris)); // make sure we get a NamedNode
    const doc = node.doc();

    if (this.isOnline()) {
      try {
        const response = await super.load(node, options);
        const etag = response.headers.get("etag");
        this.putToCache(doc, etag);
        return response as T extends Array<string | NamedNode>
          ? Response[]
          : Response;
      } catch (e) {
        const error = e as FetchError;
        if (error.status === 999) {
          // this status is returned by the original load method for non-http errors
          return await this.retrieveFromCache(doc, error);
        } else {
          // ISSUE fallback to cache on http error codes? https://github.com/pod-os/PodOS/issues/112
          throw error;
        }
      }
    } else {
      return await this.retrieveFromCache(
        doc,
        new Error(
          `You are offline and no data was found in the offline cache for ${doc.uri}`,
        ),
      );
    }
  }

  private putToCache(doc: NamedNode, etag: string | null) {
    const triples = serialize(doc, this.store, null, "application/n-triples");
    this.offlineCache.put({
      url: doc.uri,
      revision: etag ?? `timestamp-${new Date().getTime()}`,
      statements: triples?.trim() ?? "",
    });
  }

  private async retrieveFromCache<T>(
    doc: NamedNode,
    errorOnCacheMiss: Error,
  ): Promise<T extends Array<string | NamedNode> ? Response[] : Response> {
    const cache = await this.offlineCache.get(doc.uri);
    if (!cache) {
      throw errorOnCacheMiss;
    }
    parse(cache.statements, this.store, doc.uri, "text/turtle");
    return new Response(cache.statements, {
      status: 200,
      headers: {
        "Content-Type": "text/turtle",
        etag: cache.revision,
      },
    }) as T extends Array<string | NamedNode> ? Response[] : Response;
  }
}
