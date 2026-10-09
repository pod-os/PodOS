import { describe, expect, it, vi } from "vitest";
import { SearchGateway } from "./SearchGateway";
import { Store } from "../Store";
import { LabelIndex } from "./LabelIndex";
import { WebIdProfile } from "../profile";
import { Thing } from "../thing";

describe(SearchGateway.name, () => {
  function setupWithFakeStore() {
    const labelIndexStub = {
      getIndexedItems: () => [],
    } as unknown as LabelIndex;
    const store = {
      fetchAll: vi.fn().mockResolvedValue(undefined),
      get: () => ({ assume: () => labelIndexStub }),
      executeUpdate: vi.fn().mockResolvedValue(undefined),
    } as unknown as Store;
    const gateway = new SearchGateway(store);
    return { gateway, store, labelIndexStub };
  }

  function profile(webId: string, labelIndexUris: string[]): WebIdProfile {
    return {
      webId,
      getPrivateLabelIndexes: () => labelIndexUris,
    } as unknown as WebIdProfile;
  }

  function aliceProfile(): WebIdProfile {
    return profile("https://alice.test/profile/card#me", [
      "https://alice.test/label-index",
    ]);
  }

  describe("caching", () => {
    it("returns the same index instance when built twice", async () => {
      // given a gateway backed by a fake store
      const { gateway, store } = setupWithFakeStore();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");
      const alice = profile("https://alice.test/profile/card#me", [
        "https://alice.test/label-index",
      ]);

      // when building a search index twice
      const first = await gateway.buildSearchIndex(alice);
      const second = await gateway.buildSearchIndex(alice);

      // then the same index instance is returned
      expect(second).toBe(first);

      // and the label index was fetched only once
      expect(fetchAllSpy).toHaveBeenCalledTimes(1);
    });

    it("builds a new index after the cache has been cleared", async () => {
      // given a gateway backed by a fake store
      const { gateway, store } = setupWithFakeStore();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");
      const alice = profile("https://alice.test/profile/card#me", [
        "https://alice.test/label-index",
      ]);

      // when building a search index, then clearing the cache, then building again
      const first = await gateway.buildSearchIndex(alice);
      gateway.clear();
      const second = await gateway.buildSearchIndex(alice);

      // then a new index is built
      expect(second).not.toBe(first);

      // and the label index was fetched again
      expect(fetchAllSpy).toHaveBeenCalledTimes(2);
    });

    it("caches the empty index built for a profile without a label index", async () => {
      // given a profile without a private label index
      const { gateway } = setupWithFakeStore();
      const emptyProfile = profile("https://pod.test/profile/card#me", []);

      // when building a search index for that profile twice
      const first = await gateway.buildSearchIndex(emptyProfile);
      const second = await gateway.buildSearchIndex(emptyProfile);

      // then an empty index is returned
      expect(first.search("anything")).toEqual([]);

      // and the same empty index instance is returned on the repeat call
      expect(second).toBe(first);
    });
  });

  describe("add to label index", () => {
    it("rebuilds the cached search index after writing to the label index", async () => {
      // given a gateway with a cached search index containing an indexed item
      const { gateway, labelIndexStub } = setupWithFakeStore();
      labelIndexStub.getIndexedItems = () => [
        { uri: "https://thing.test#it", label: "Something" },
      ];
      const cachedIndex = await gateway.buildSearchIndex(
        profile("https://alice.test/profile/card#me", [
          "https://alice.test/label-index",
        ]),
      );

      // and the store meanwhile contains the label of another thing
      labelIndexStub.getIndexedItems = () => [
        { uri: "https://thing.test#it", label: "Something" },
        { uri: "https://thing.test#other", label: "Another Thing" },
      ];

      // when adding another thing to the label index
      const thing = {
        uri: "https://thing.test#other",
        label: () => "Another Thing",
      } as unknown as Thing;
      const labelIndex = { uri: "https://alice.test/label-index" } as LabelIndex;
      await gateway.addToLabelIndex(thing, labelIndex);

      // then the cached index still is the same instance
      expect(await gateway.buildSearchIndex(aliceProfile())).toBe(cachedIndex);

      // and the cached index contains the added item
      const results = cachedIndex.search("Another Thing");
      expect(results).toHaveLength(1);
      expect(results[0].ref).toEqual("https://thing.test#other");
    });

    it("does not build a search index when adding to a label index without a cache", async () => {
      // given a gateway with no cached search index
      const { gateway, store, labelIndexStub } = setupWithFakeStore();
      labelIndexStub.getIndexedItems = () => [
        { uri: "https://thing.test#it", label: "Something" },
      ];
      const fetchAllSpy = vi.spyOn(store, "fetchAll");

      // when adding a thing to a label index
      const thing = {
        uri: "https://thing.test#it",
        label: () => "Something",
      } as unknown as Thing;
      const labelIndex = { uri: "https://alice.test/label-index" } as LabelIndex;
      await gateway.addToLabelIndex(thing, labelIndex);

      // then no index was built
      expect(fetchAllSpy).not.toHaveBeenCalled();
    });
  });

  describe("create default label index", () => {
    it.todo("recreates the cached search index after creating a default label index");
  });
});
