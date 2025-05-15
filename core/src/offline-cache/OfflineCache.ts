export interface CachedRdfDocument {
  url: string;
  revision: string;
  statements: string;
}

export interface OfflineCache {
  put(document: CachedRdfDocument): void;
  get(url: string): Promise<CachedRdfDocument | undefined>;
}

export class NoOfflineCache implements OfflineCache {
  put() {}
  async get(): Promise<undefined> {
    return undefined;
  }
}
