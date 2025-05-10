export interface CachedRdfDocument {
  url: string;
  revision: string;
  statements: string[];
}

export interface OfflineCache {
  put(document: CachedRdfDocument): void;
}

export class NoOfflineCache implements OfflineCache {
  put() {}
}
