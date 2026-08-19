import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, it } from '@stencil/vitest';
import { BrowserSession } from './BrowserSession';
import { Session } from '@uvdsl/solid-oidc-client-browser';

import { firstValueFrom } from 'rxjs';

vi.mock('@uvdsl/solid-oidc-client-browser', () => ({
  Session: vi.fn(),
}));

describe('BrowserSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticated fetch', () => {
    it('calls the session auth fetch', () => {
      const authFetch = vi.fn();
      (Session as any).mockImplementation(
        class {
          authFetch = authFetch;
        },
      );

      const session = new BrowserSession();
      session.authenticatedFetch('some-url');
      expect(authFetch).toHaveBeenCalledWith('some-url');
    });

    it('`this` is bound to session object', () => {
      const authFetch = function () {
        // @ts-ignore
        return this.internalValue;
      };
      (Session as any).mockImplementation(
        class {
          // noinspection JSUnusedGlobalSymbols
          internalValue = 'internal-value';
          authFetch = authFetch;
        },
      );

      const session = new BrowserSession();
      expect(session.authenticatedFetch('irrelevant')).toEqual('internal-value');
    });
  });

  describe('handleIncomingRedirect', () => {
    let session: BrowserSession;
    let handleRedirectFromLogin: Mock;
    let restore: Mock;
    beforeEach(() => {
      handleRedirectFromLogin = vi.fn();
      restore = vi.fn();
      (Session as any).mockImplementation(
        class {
          authFetch = vi.fn();
          isActive = true;
          webId = 'http://pod.test/alice#me';
          handleRedirectFromLogin = handleRedirectFromLogin;
          restore = restore;
        },
      );
      session = new BrowserSession();
    });
    it('handles redirect from login', async () => {
      await session.handleIncomingRedirect();
      expect(handleRedirectFromLogin).toHaveBeenCalled();
      const result = await firstValueFrom(session.observeSession());
      expect(result).toEqual({
        isLoggedIn: true,
        webId: 'http://pod.test/alice#me',
      });
    });
    describe('session restore', () => {
      let sessionRestoreCallback: Mock;
      beforeEach(() => {
        sessionRestoreCallback = vi.fn();
        session.onSessionRestore(sessionRestoreCallback);
      });

      it('does not restore session by default', async () => {
        await session.handleIncomingRedirect();
        expect(restore).not.toHaveBeenCalled();
        expect(sessionRestoreCallback).not.toHaveBeenCalled();
      });

      it('restores session, if explicitly configured', async () => {
        (globalThis as any).window = {
          location: {
            href: 'https://current.test',
          },
        };
        const sessionRestoreCallback = vi.fn();
        session.onSessionRestore(sessionRestoreCallback);
        await session.handleIncomingRedirect(true);
        expect(restore).toHaveBeenCalled();
        expect(sessionRestoreCallback).toHaveBeenCalledWith('https://current.test');
      });
    });
  });

  describe('login', () => {
    it('logs in with given idp and current location as redirect url', () => {
      (globalThis as any).window = {
        location: {
          href: 'https://current.test',
        },
      };
      const login = vi.fn();
      (Session as any).mockImplementation(
        class {
          authFetch = vi.fn();
          login = login;
        },
      );
      const session = new BrowserSession();
      session.login('https://pod.test/');
      expect(login).toHaveBeenCalledWith('https://pod.test/', 'https://current.test');
    });
  });

  describe('logout', () => {
    it('logs out', async () => {
      const logout = vi.fn();
      (Session as any).mockImplementation(
        class {
          authFetch = vi.fn();
          isActive = true;
          webId = 'http://pod.test/alice#me';
          logout = logout;
        },
      );
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
