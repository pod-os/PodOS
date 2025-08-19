import { BrowserSession } from "./BrowserSession";
import { Session } from "@uvdsl/solid-oidc-client-browser";
import { first, firstValueFrom } from "rxjs";

jest.mock("@uvdsl/solid-oidc-client-browser", () => ({
  Session: jest.fn(),
}));

describe("BrowserSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticated fetch", () => {
    it("calls the session auth fetch", () => {
      const authFetch = jest.fn();
      (Session as jest.Mock).mockImplementation(() => {
        return {
          authFetch,
        };
      });

      const session = new BrowserSession();
      session.authenticatedFetch("some-url");
      expect(authFetch).toHaveBeenCalledWith("some-url");
    });

    it("`this` is bound to session object", () => {
      const authFetch = function () {
        // @ts-expect-error testing that this is correctly bound here
        return this.internalValue;
      };
      (Session as jest.Mock).mockImplementation(() => {
        return {
          internalValue: "internal-value",
          authFetch,
        };
      });

      const session = new BrowserSession();
      expect(session.authenticatedFetch("irrelevant")).toEqual(
        "internal-value",
      );
    });
  });

  describe("handleIncomingRedirect", () => {
    let session: BrowserSession;
    let handleRedirectFromLogin: jest.Mock;
    let restore: jest.Mock;
    beforeEach(() => {
      handleRedirectFromLogin = jest.fn();
      restore = jest.fn();
      (Session as jest.Mock).mockImplementation(() => {
        return {
          authFetch: jest.fn(),
          isActive: true,
          webId: "http://pod.test/alice#me",
          handleRedirectFromLogin,
          restore,
        };
      });
      session = new BrowserSession();
    });
    it("handles redirect from login", async () => {
      await session.handleIncomingRedirect();
      expect(handleRedirectFromLogin).toHaveBeenCalled();
      const result = await firstValueFrom(session.observeSession());
      expect(result).toEqual({
        isLoggedIn: true,
        webId: "http://pod.test/alice#me",
      });
    });
    describe("session restore", () => {
      let sessionRestoreCallback: jest.Mock;
      beforeEach(() => {
        sessionRestoreCallback = jest.fn();
        session.onSessionRestore(sessionRestoreCallback);
      });

      it("does not restore session by default", async () => {
        await session.handleIncomingRedirect();
        expect(restore).not.toHaveBeenCalled();
        expect(sessionRestoreCallback).not.toHaveBeenCalled();
      });

      it("restores session, if explicitly configured", async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).window = {
          location: {
            href: "https://current.test",
          },
        };
        const sessionRestoreCallback = jest.fn();
        session.onSessionRestore(sessionRestoreCallback);
        await session.handleIncomingRedirect(true);
        expect(restore).toHaveBeenCalled();
        expect(sessionRestoreCallback).toHaveBeenCalledWith(
          "https://current.test",
        );
      });
    });
  });

  describe("login", () => {
    it("logs in with given idp and current location as redirect url", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window = {
        location: {
          href: "https://current.test",
        },
      };
      const login = jest.fn();
      (Session as jest.Mock).mockImplementation(() => {
        return {
          authFetch: jest.fn(),
          login,
        };
      });
      const session = new BrowserSession();
      session.login("https://pod.test/");
      expect(login).toHaveBeenCalledWith(
        "https://pod.test/",
        "https://current.test",
      );
    });
  });

  describe("logout", () => {
    it("logs out", async () => {
      const logout = jest.fn();
      (Session as jest.Mock).mockImplementation(() => {
        return {
          authFetch: jest.fn(),
          isActive: true,
          webId: "http://pod.test/alice#me",
          logout,
        };
      });
      const session = new BrowserSession();
      await session.logout();
      expect(logout).toHaveBeenCalled();
      const sessionInfo = await firstValueFrom(session.observeSession());
      expect(sessionInfo).toEqual({
        isLoggedIn: false,
      });
    });
  });
});
