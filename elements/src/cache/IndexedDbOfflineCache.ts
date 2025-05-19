import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { CachedRdfDocument, OfflineCache } from '@pod-os/core';

interface OfflineCacheDb extends DBSchema {
  documents: {
    key: string;
    value: CachedRdfDocument;
    indexes: {
      'url-revision': [string, string];
    };
  };
}

/**
 * An offline cache backed by the browsers IndexedDB storage
 */
export class IndexedDbOfflineCache implements OfflineCache {
  private readonly dbPromise: Promise<IDBPDatabase<OfflineCacheDb>>;

  constructor() {
    this.dbPromise = openDB<OfflineCacheDb>('OfflineCacheDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('documents')) {
          const store = db.createObjectStore('documents', { keyPath: 'url' });
          store.createIndex('url-revision', ['url', 'revision']);
        }
      },
    });
  }

  async clear() {
    const db = await this.dbPromise;
    return db.clear('documents');
  }

  async get(url: string): Promise<CachedRdfDocument | undefined> {
    const db = await this.dbPromise;
    return await db.get('documents', url);
  }

  async put(document: CachedRdfDocument) {
    const db = await this.dbPromise;
    const existing = await db.getFromIndex('documents', 'url-revision', [document.url, document.revision]);

    if (existing) {
      return; // No need to update if the revision is the same
    }
    await db.put('documents', document);
  }
}
