import { beforeEach, describe, expect, it, vi } from "vitest";
import { OfflineCache, PodOS, PodOsSession, SessionInfo } from "./index";
import { BehaviorSubject, of } from "rxjs";
import { mockTurtleDocument } from "./test-support";

vi.mock("./authentication", () => ({}));

describe("PodOS", () => {
  let mockSession: PodOsSession;

  beforeEach(() => {
    mockSession = {
      logout: vi.fn(),
      observeSession: vi.fn().mockReturnValue(of()),
    } as unknown as PodOsSession;
  });

  describe("logout", () => {
    it("calls logout on the browser session", async () => {
      const podOs = new PodOS({ session: mockSession });

      await podOs.logout();

      expect(mockSession.logout).toHaveBeenCalled();
    });

    it("clears the cache", async () => {
      const mockOfflineCache = { clear: vi.fn() } as unknown as OfflineCache;
      const podOs = new PodOS({
        session: mockSession,
        offlineCache: mockOfflineCache,
      });

      await podOs.logout();

      expect(mockOfflineCache.clear).toHaveBeenCalled();
    });
  });

  describe("session boundary", () => {
    it("re-fetches an already loaded document after the session changes", async () => {
      // given a session that emits session changes
      const sessionSubject = new BehaviorSubject<SessionInfo>({
        isLoggedIn: false,
      });
      const fetchMock = vi.fn();
      const session = {
        logout: vi.fn(),
        authenticatedFetch: fetchMock,
        observeSession: () => sessionSubject,
      } as unknown as PodOsSession;
      const podOs = new PodOS({ session });

      // and a document is already loaded into the store
      mockTurtleDocument(
        fetchMock,
        "https://pod.test/resource",
        '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .',
      );
      await podOs.fetch("https://pod.test/resource");

      // when the session changes
      sessionSubject.next({ isLoggedIn: false });

      // then fetching the same document again hits the network again
      await podOs.fetch("https://pod.test/resource");
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("search index cache", () => {
    it("rebuilds the search index after a session change and re-login", async () => {
      // given a session that emits session changes, logged in at alice
      const sessionSubject = new BehaviorSubject<SessionInfo>({
        isLoggedIn: true,
        webId: "https://alice.test/profile/card#me",
      });
      const fetchMock = vi.fn();
      const session = {
        logout: vi.fn(),
        authenticatedFetch: fetchMock,
        observeSession: () => sessionSubject,
      } as unknown as PodOsSession;
      const podOs = new PodOS({ session });

      // and alice's profile and label index contain one indexed item
      mockTurtleDocument(
        fetchMock,
        "https://alice.test/profile/card",
        `
      <https://alice.test/profile/card#me> <http://www.w3.org/ns/solid/terms#privateLabelIndex> <https://alice.test/label-index> .
    `,
      );
      mockTurtleDocument(
        fetchMock,
        "https://alice.test/label-index",
        `
      <https://thing.test#it> <http://www.w3.org/2000/01/rdf-schema#label> "Something" .
    `,
      );

      // when building the search index while logged in
      const first = await podOs.buildSearchIndex();
      expect(first.search("Something")).toHaveLength(1);

      // and the session changes, the tap fires, and the user logs in again
      sessionSubject.next({ isLoggedIn: false });
      sessionSubject.next({
        isLoggedIn: true,
        webId: "https://mallory.test/profile/card#me",
      });

      // and mallory's profile and label index contain another indexed item
      mockTurtleDocument(
        fetchMock,
        "https://mallory.test/profile/card",
        `
      <https://mallory.test/profile/card#me> <http://www.w3.org/ns/solid/terms#privateLabelIndex> <https://mallory.test/label-index> .
    `,
      );
      mockTurtleDocument(
        fetchMock,
        "https://mallory.test/label-index",
        `
      <https://thing.test#other> <http://www.w3.org/2000/01/rdf-schema#label> "Other Thing" .
    `,
      );

      // and the search index is built again
      const second = await podOs.buildSearchIndex();

      // then a new index is built after the re-login
      expect(second).not.toBe(first);

      // and it contains the item indexed for the re-logged-in user
      expect(second.search("Other Thing")).toHaveLength(1);
      expect(second.search("Something")).toEqual([]);
    });
  });
});
