import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  OfflineCache,
  PodOS,
  PodOsSession,
  SessionInfo,
} from "./index";
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

  describe("search index cache", () => {
    it("clears the cached search index when the session changes", async () => {
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
      mockTurtleDocument(fetchMock, "https://alice.test/profile/card", "");
      mockTurtleDocument(
        fetchMock,
        "https://alice.test/label-index",
        `
      <https://thing.test#it> <http://www.w3.org/2000/01/rdf-schema#label> "Something" .
    `,
      );

      // when building the search index, then the session changes, then building again
      const first = await podOs.buildSearchIndex();
      sessionSubject.next({ isLoggedIn: false });
      const second = await podOs.buildSearchIndex();

      // then a new index is built after the session change
      expect(second).not.toBe(first);

      // and the reference held before the session change serves an empty index
      expect(first.search("anything")).toEqual([]);

      // and the held reference does not serve the item indexed for alice anymore
      expect(first.search("Something")).toEqual([]);
    });
  });
});
