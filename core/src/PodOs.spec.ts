import { beforeEach, describe, expect, it, vi } from "vitest";
import { OfflineCache, PodOS, PodOsSession } from "./index";
import { of } from "rxjs";

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
});
