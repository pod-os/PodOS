import { BrowserSession, OfflineCache, PodOS } from "./index";
import { of } from "rxjs";

jest.mock("./authentication", () => ({}));

describe("PodOS", () => {
  let mockSession: BrowserSession;

  beforeEach(() => {
    mockSession = {
      logout: jest.fn(),
      observeSession: jest.fn().mockReturnValue(of()),
    } as unknown as BrowserSession;
  });

  describe("logout", () => {
    it("calls logout on the browser session", async () => {
      const podOs = new PodOS({ session: mockSession });

      await podOs.logout();

      expect(mockSession.logout).toHaveBeenCalled();
    });

    it("clears the cache", async () => {
      const mockOfflineCache = { clear: jest.fn() } as unknown as OfflineCache;
      const podOs = new PodOS({
        session: mockSession,
        offlineCache: mockOfflineCache,
      });

      await podOs.logout();

      expect(mockOfflineCache.clear).toHaveBeenCalled();
    });
  });
});
