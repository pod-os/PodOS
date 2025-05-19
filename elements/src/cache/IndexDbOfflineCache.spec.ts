jest.mock('idb');

import { IndexedDbOfflineCache } from './IndexedDbOfflineCache';
import { when } from 'jest-when';
import { IDBPDatabase, openDB } from 'idb';

import { CachedRdfDocument } from '@pod-os/core';

describe('IndexDbOfflineCache', () => {
  let db: IDBPDatabase;
  let cache: IndexedDbOfflineCache;

  beforeEach(() => {
    db = {
      put: jest.fn(),
      get: jest.fn(),
      clear: jest.fn(),
      getFromIndex: jest.fn(),
    } as unknown as IDBPDatabase;
    const dbPromise = Promise.resolve(db);
    when(openDB).calledWith('OfflineCacheDB', 1, expect.anything()).mockReturnValue(dbPromise);
    cache = new IndexedDbOfflineCache();
  });

  describe('put', () => {
    it('should store document in IndexDB if not present yet', async () => {
      // given no existing document in cache
      when(db.getFromIndex).mockResolvedValue(undefined);

      // and a document to store
      const document: CachedRdfDocument = {
        url: 'https://document.example/',
        statements: 'test content',
        revision: 'etag',
      };

      // when the document is put to the cache
      await cache.put(document);

      // then it is put to the IndexedDB documents store
      expect(db.put).toHaveBeenCalledWith('documents', document);
    });

    it('should store document in IndexDB when revision is new', async () => {
      // given no existing document in cache
      when(db.getFromIndex)
        .calledWith('documents', 'url-revision', ['https://document.example/', 'old-revision'])
        .mockResolvedValue({
          url: 'https://document.example/',
          statements: 'test content',
          revision: 'old-revision',
        });

      // and a document to store
      const document: CachedRdfDocument = {
        url: 'https://document.example/',
        statements: 'test content',
        revision: 'new-revision',
      };

      // when the document is put to the cache
      await cache.put(document);

      // then it is put to the IndexedDB documents store
      expect(db.put).toHaveBeenCalledWith('documents', document);
    });

    it('should not store document when revision is still the same', async () => {
      // given an existing document in cache
      const existingDoc: CachedRdfDocument = {
        url: 'https://document.example/',
        statements: 'known content',
        revision: 'known-revision',
      };
      when(db.getFromIndex)
        .calledWith('documents', 'url-revision', ['https://document.example/', 'known-revision'])
        .mockResolvedValue(existingDoc);

      // and a document with same revision
      const document: CachedRdfDocument = {
        url: 'https://document.example/',
        statements: 'might actually change, but we trust the revision',
        revision: 'known-revision',
      };

      // when the document is put to the cache
      await cache.put(document);

      // then it is not put to the IndexedDB
      expect(db.put).not.toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should get undefined when no document is found', async () => {
      // given no existing document in cache
      when(db.get).calledWith('documents', 'https://document.example/').mockResolvedValue(undefined);

      // when the document is retrieved from the cache
      const result = await cache.get('https://document.example/');

      // then it returns undefined
      expect(result).toBeUndefined();
    });

    it('should get document when it is found', async () => {
      // given an existing document in cache
      const existingDoc: CachedRdfDocument = {
        url: 'https://document.example/',
        statements: 'known content',
        revision: 'known-revision',
      };
      when(db.get).calledWith('documents', 'https://document.example/').mockResolvedValue(existingDoc);

      // when the document is retrieved from the cache
      const result = await cache.get('https://document.example/');

      // then it returns the document
      expect(result).toEqual(existingDoc);
    });
  });

  describe('clear', () => {
    it('should clear all documents from IndexDB', async () => {
      const cache = new IndexedDbOfflineCache();
      await cache.clear();
      expect(db.clear).toHaveBeenCalledWith('documents');
    });
  });
});
