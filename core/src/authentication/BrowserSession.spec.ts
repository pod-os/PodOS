import { BrowserSession } from "./BrowserSession";

jest.mock("@uvdsl/solid-oidc-client-browser", () => ({
  Session: jest.fn(),
}));

import { Session } from "@uvdsl/solid-oidc-client-browser";

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
});
