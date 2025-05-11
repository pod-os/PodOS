import { IndexedDbOfflineCache } from "./IndexedDbOfflineCache";
import { CachedRdfDocument } from "../OfflineCache";
import { when } from "jest-when";
import { IDBPDatabase, openDB } from "idb";

jest.mock("idb");

describe("IndexDbOfflineCache", () => {
  describe("put", () => {
    it("should store document in IndexDB", async () => {
      // given openDB opens a new indexeddb database
      const db = {
        put: jest.fn(),
      } as unknown as IDBPDatabase;
      const dbPromise = Promise.resolve(db);
      when(openDB)
        .calledWith("OfflineCacheDB", 1, expect.anything())
        .mockReturnValue(dbPromise);

      // and an offline cached using IndexedDB
      const cache = new IndexedDbOfflineCache();

      // and a document to store
      const document: CachedRdfDocument = {
        url: "https://document.example/",
        statements: "test content",
        revision: "etag",
      };

      // when the document is put to the cache
      await cache.put(document);

      // then it is put to the IndexedDB documents store
      expect(db.put).toHaveBeenCalledWith("documents", document);
    });
  });
});
