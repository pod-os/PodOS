import { CachedRdfDocument, OfflineCache } from "../OfflineCache";

export class IndexDbOfflineCache implements OfflineCache {
  put(document: CachedRdfDocument): void {
    console.log("IndexDbOfflineCache: put", document);
  }
}
