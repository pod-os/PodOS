import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  OfflineCache,
  PodOS,
  PodOsSession,
  SessionInfo,
  WebIdProfile,
} from "./index";
import { BehaviorSubject, of } from "rxjs";

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
      // given a session that emits session changes
      const sessionSubject = new BehaviorSubject<SessionInfo>({
        isLoggedIn: false,
      });
      const session = {
        logout: vi.fn(),
        observeSession: () => sessionSubject,
      } as unknown as PodOsSession;
      const podOs = new PodOS({ session });

      // and a profile without a private label index
      const profile = {
        webId: "https://alice.test/profile/card#me",
        getPrivateLabelIndexes: () => [],
      } as unknown as WebIdProfile;

      // when building a search index, then the session changes, then building again
      const first = await podOs.buildSearchIndex(profile);
      sessionSubject.next({ isLoggedIn: false });
      const second = await podOs.buildSearchIndex(profile);

      // then a new index is built after the session change
      expect(second).not.toBe(first);
    });
  });
});
