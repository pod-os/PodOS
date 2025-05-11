import { CachedRdfDocument, OfflineCache } from "../OfflineCache";
import { DBSchema, IDBPDatabase, openDB } from "idb";

interface OfflineCacheDb extends DBSchema {
  documents: {
    key: string;
    value: CachedRdfDocument;
  };
}

export class IndexedDbOfflineCache implements OfflineCache {
  private readonly dbPromise: Promise<IDBPDatabase<OfflineCacheDb>>;

  constructor() {
    this.dbPromise = openDB<OfflineCacheDb>("OfflineCacheDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("documents")) {
          db.createObjectStore("documents", { keyPath: "url" });
        }
      },
    });
  }

  async put(document: CachedRdfDocument): Promise<void> {
    const db = await this.dbPromise;
    const existing = await db.get("documents", document.url);
    if (existing && existing.revision === document.revision) {
      return; // No need to update if the revision is the same
    }
    await db.put("documents", document);
  }
}
