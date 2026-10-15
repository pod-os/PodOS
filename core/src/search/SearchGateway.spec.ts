import { describe, expect, it, vi } from "vitest";
import { BehaviorSubject } from "rxjs";
import { SearchGateway } from "./SearchGateway";
import { PodOsSession, SessionInfo } from "../authentication";
import { Store } from "../Store";
import { LabelIndex } from "./LabelIndex";
import { ProfileGateway, WebIdProfile } from "../profile";
import { Thing } from "../thing";

describe(SearchGateway.name, () => {
  function fakeSession(
    sessionInfo: { isLoggedIn: boolean; webId?: string } = {
      isLoggedIn: true,
      webId: "https://alice.test/profile/card#me",
    },
  ) {
    return {
      observeSession: () =>
        new BehaviorSubject<SessionInfo>(sessionInfo),
    } as unknown as PodOsSession;
  }

  function setupWithFakeStore(
    sessionInfo: { isLoggedIn: boolean; webId?: string } = {
      isLoggedIn: true,
      webId: "https://alice.test/profile/card#me",
    },
  ) {
    const labelIndexStub = {
      getIndexedItems: () => [],
    } as unknown as LabelIndex;
    const store = {
      fetch: vi.fn().mockResolvedValue(undefined),
      fetchAll: vi.fn().mockResolvedValue(undefined),
      get: () => ({ assume: () => labelIndexStub }),
      executeUpdate: vi.fn().mockResolvedValue(undefined),
    } as unknown as Store;
    const profileGateway = fakeProfileGateway();
    const gateway = new SearchGateway(store, fakeSession(sessionInfo), profileGateway);
    return { gateway, store, labelIndexStub, profileGateway };
  }

  function fakeProfileGateway(): ProfileGateway {
    return {
      fetchProfile: vi.fn().mockResolvedValue(
        profile("https://alice.test/profile/card#me", [
          "https://alice.test/label-index",
        ]),
      ),
    } as unknown as ProfileGateway;
  }

  describe("demand api", () => {
    it("builds an empty index without caching it when logged out", async () => {
      // given a gateway with no session (not logged in)
      const { gateway } = setupWithFakeStore({ isLoggedIn: false });

      // when building the search index without arguments
      const result = await gateway.buildSearchIndex();

      // then an empty index is returned
      expect(result.search("anything")).toEqual([]);
    });
  });

  function profile(webId: string, labelIndexUris: string[]): WebIdProfile {
    return {
      webId,
      getPreferencesFile: () => undefined,
      getPrivateLabelIndexes: () => labelIndexUris,
    } as unknown as WebIdProfile;
  }

  describe("caching", () => {
    it("returns the same index instance when built twice", async () => {
      // given a gateway backed by a fake store
      const { gateway, store } = setupWithFakeStore();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");

      // when building a search index twice
      const first = await gateway.buildSearchIndex();
      const second = await gateway.buildSearchIndex();

      // then the same index instance is returned
      expect(second).toBe(first);

      // and the label index was fetched only once
      expect(fetchAllSpy).toHaveBeenCalledTimes(1);
    });

    it("builds a new index after the cache has been cleared", async () => {
      // given a gateway backed by a fake store
      const { gateway, store } = setupWithFakeStore();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");

      // when building a search index, then clearing the cache, then building again
      const first = await gateway.buildSearchIndex();
      gateway.clear();
      const second = await gateway.buildSearchIndex();

      // then a new index is built
      expect(second).not.toBe(first);

      // and the label index was fetched again
      expect(fetchAllSpy).toHaveBeenCalledTimes(2);
    });

    it("caches the empty index built for a profile without a label index", async () => {
      // given a logged-in session for a profile without a private label index
      const profileGateway = {
        fetchProfile: vi.fn().mockResolvedValue(
          profile("https://pod.test/profile/card#me", []),
        ),
      } as unknown as ProfileGateway;
      const { store } = setupWithFakeStore();
      const gateway = new SearchGateway(store, fakeSession(), profileGateway);

      // when building a search index twice
      const first = await gateway.buildSearchIndex();
      const second = await gateway.buildSearchIndex();

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
      const cachedIndex = await gateway.buildSearchIndex();

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
      expect(await gateway.buildSearchIndex()).toBe(cachedIndex);

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
    it("recreates the cached search index including the new label index document", async () => {
      // given a gateway with a cached search index built from one label index document
      const { gateway, store, labelIndexStub } = setupWithFakeStore();
      labelIndexStub.getIndexedItems = () => [
        { uri: "https://thing.test#it", label: "Something" },
      ];
      const cachedIndex = await gateway.buildSearchIndex();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");

      // when creating a default label index, so that the profile now links two label indexes
      const updatedProfile = profile("https://alice.test/profile/card#me", [
        "https://alice.test/label-index",
        "https://alice.test/profile/privateLabelIndex.ttl",
      ]);
      await gateway.createDefaultLabelIndex(updatedProfile);

      // then the cached index is still the same instance, updated in place
      expect(await gateway.buildSearchIndex()).toBe(cachedIndex);

      // and the label indexes were refetched, including the new document
      expect(fetchAllSpy).toHaveBeenLastCalledWith([
        "https://alice.test/label-index",
        "https://alice.test/profile/privateLabelIndex.ttl",
      ]);

      // and items added to the new label index afterwards are found by the cache
      labelIndexStub.getIndexedItems = () => [
        { uri: "https://thing.test#it", label: "Something" },
        { uri: "https://thing.test#fresh", label: "Fresh Thing" },
      ];
      const thing = {
        uri: "https://thing.test#fresh",
        label: () => "Fresh Thing",
      } as unknown as Thing;
      await gateway.addToLabelIndex(
        thing,
        new LabelIndex(
          "https://alice.test/profile/privateLabelIndex.ttl",
          store,
        ),
      );
      const results = (await gateway.buildSearchIndex()).search(
        "Fresh Thing",
      );
      expect(results).toHaveLength(1);
      expect(results[0].ref).toEqual("https://thing.test#fresh");
    });

    it("does not build a search index when creating a default label index without a cache", async () => {
      // given a gateway with no cached search index
      const { gateway, store } = setupWithFakeStore();
      const fetchAllSpy = vi.spyOn(store, "fetchAll");

      // when creating a default label index
      await gateway.createDefaultLabelIndex(
        profile("https://alice.test/profile/card#me", [
          "https://alice.test/label-index",
        ]),
      );

      // then no index was built
      expect(fetchAllSpy).not.toHaveBeenCalled();
    });
  });
});

