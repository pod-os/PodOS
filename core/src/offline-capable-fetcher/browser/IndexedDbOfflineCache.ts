import { CachedRdfDocument, OfflineCache } from "../OfflineCache";
import { IDBPDatabase, openDB } from "idb";

export class IndexedDbOfflineCache implements OfflineCache {
  private readonly dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB("OfflineCacheDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("documents")) {
          db.createObjectStore("documents", { keyPath: "url" });
        }
      },
    });
  }

  async put(document: CachedRdfDocument): Promise<void> {
    const db = await this.dbPromise;
    const existing = (await db.get("documents", document.url)) as
      | CachedRdfDocument
      | undefined;
    if (existing && existing.revision === document.revision) {
      return; // No need to update if the revision is the same
    }
    await db.put("documents", document);
  }
}
