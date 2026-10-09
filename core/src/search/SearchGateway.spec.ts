import { describe, expect, it, vi } from "vitest";
import { SearchGateway } from "./SearchGateway";
import { Store } from "../Store";
import { LabelIndex } from "./LabelIndex";
import { WebIdProfile } from "../profile";

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
    return { gateway, store };
  }

  function profile(webId: string, labelIndexUris: string[]): WebIdProfile {
    return {
      webId,
      getPrivateLabelIndexes: () => labelIndexUris,
    } as unknown as WebIdProfile;
  }

  describe("caching", () => {
    it("returns the same index instance when built twice for the same webId", async () => {
      // given a gateway backed by a fake store
      const { gateway, store } = setupWithFakeStore();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");
      const alice = profile("https://alice.test/profile/card#me", [
        "https://alice.test/label-index",
      ]);

      // when building a search index for the same profile twice
      const first = await gateway.buildSearchIndex(alice);
      const second = await gateway.buildSearchIndex(alice);

      // then the same index instance is returned
      expect(second).toBe(first);

      // and the label index was fetched only once
      expect(fetchAllSpy).toHaveBeenCalledTimes(1);
    });

    it("rebuilds the index when built for a different webId", async () => {
      // given a gateway backed by a fake store
      const { gateway, store } = setupWithFakeStore();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");

      // when building search indexes for two different profiles
      const aliceIndex = await gateway.buildSearchIndex(
        profile("https://alice.test/profile/card#me", [
          "https://alice.test/label-index",
        ]),
      );
      const bobIndex = await gateway.buildSearchIndex(
        profile("https://bob.test/profile/card#me", [
          "https://bob.test/label-index",
        ]),
      );

      // then a new index is built for the different webId
      expect(bobIndex).not.toBe(aliceIndex);

      // and both label indexes were fetched
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
});
