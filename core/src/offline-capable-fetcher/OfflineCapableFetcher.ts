import {
  AutoInitOptions,
  Fetcher,
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
      // TODO test this case
      return (await super.load<Array<string | NamedNode>>(
        oneOrMoreUris,
        options,
      )) as T extends Array<string | NamedNode> ? Response[] : Response;
    }

    const node = sym(termValue(oneOrMoreUris)); // make sure we get a NamedNode
    const doc = node.doc();

    if (this.isOnline()) {
      const response = await super.load(node, options);

      const etag = response.headers.get("etag");

      const triples = serialize(doc, this.store, null, "application/n-triples");
      this.offlineCache.put({
        url: doc.uri,
        revision: etag ?? "", // TODO handle missing etag
        statements: triples?.trim() ?? "",
      });
      return response as T extends Array<string | NamedNode>
        ? Response[]
        : Response;
    } else {
      const cache = await this.offlineCache.get(doc.uri);
      if (!cache) {
        throw new Error(
          `You are offline, but the requested the document (${doc}) was not found in the offline cache.`,
        );
      }
      parse(cache.statements, this.store, doc.uri, "text/turtle");
      const response = new Response(cache.statements);
      response.headers.set("Content-Type", "text/turtle");
      response.headers.set("etag", cache.revision);
      return response as T extends Array<string | NamedNode>
        ? Response[]
        : Response;
    }
  }
}
