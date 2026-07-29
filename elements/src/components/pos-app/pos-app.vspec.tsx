import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, it, afterEach, render, h, RenderResult } from '@stencil/vitest';
vi.mock('../../authentication', () => ({
  BrowserSession: vi.fn(
    class {
      onSessionRestore = () => {};
      handleIncomingRedirect = () => {};
    },
  ),
}));

vi.mock('../../pod-os', () => ({
  createPodOS: vi.fn(),
}));

import { localSettings } from '../../store/settings';

import { fireEvent } from '@testing-library/dom';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { createPodOS } from '../../pod-os';
import './pos-app';
import { BrowserSession } from '../../authentication';
import { SessionInfo } from '@pod-os/core';

describe('pos-app', () => {
  describe('load preferences', () => {
    const mockFetchProfile = vi.fn();
    let sessionInfo$: BehaviorSubject<SessionInfo>;
    let page: RenderResult;

    beforeEach(() => {
      sessionInfo$ = new BehaviorSubject<SessionInfo>({ isLoggedIn: false, webId: '' });
      vi.resetAllMocks();

      (createPodOS as Mock).mockReturnValue({
        observeSession: () => sessionInfo$,
        fetchProfile: mockFetchProfile,
      });
    });

    afterEach(() => {
      page.instance.disconnectedCallback();
    });

    it('does not load the preferences before login', async () => {
      page = await render(<pos-app>item body</pos-app>);

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockFetchProfile).not.toHaveBeenCalled();
    });

    it('loads the preferences after login', async () => {
      page = await render(<pos-app>item body</pos-app>);

      sessionInfo$.next({
        isLoggedIn: true,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockFetchProfile).toHaveBeenCalledWith('https://pod.test/alice#me');
    });
  });

  describe('load module', () => {
    const mockLoadContactsModule = vi.fn();

    beforeEach(() => {
      vi.resetAllMocks();

      (createPodOS as Mock).mockReturnValue({
        observeSession: () => EMPTY,
        loadContactsModule: mockLoadContactsModule,
      });
    });

    it('loads the contacts module', async () => {
      // given
      const loadModule = vi.fn().mockResolvedValue('fake contacts module');
      const receiver = vi.fn();
      const page = await render(<pos-app>item body</pos-app>);

      page.instance.os = {
        loadModule,
      };

      // when
      fireEvent(page.root, new CustomEvent('pod-os:module', { detail: { module: 'contacts', receiver } }));
      await page.waitForChanges();

      // then
      expect(loadModule).toHaveBeenCalled();
      expect(receiver).toHaveBeenCalledWith('fake contacts module');
      page.instance.disconnectedCallback();
    });
  });

  describe('handle incoming redirect', () => {
    const mockHandleIncomingRedirect = vi.fn();
    let sessionRestoredCallback: (url: string) => any;
    let sessionInfo$: BehaviorSubject<SessionInfo>;
    let page: RenderResult;

    beforeEach(() => {
      sessionInfo$ = new BehaviorSubject<SessionInfo>({ isLoggedIn: false, webId: '' });
      vi.resetAllMocks();

      (BrowserSession as Mock).mockImplementation(
        // @ts-ignore
        class {
          onSessionRestore = (callback: () => any) => (sessionRestoredCallback = callback);
          handleIncomingRedirect = mockHandleIncomingRedirect;
        },
      );

      (createPodOS as Mock).mockReturnValue({
        observeSession: () => sessionInfo$,
        fetchProfile: () => null,
      });
    });

    afterEach(() => {
      page.instance.disconnectedCallback();
    });

    it('does not restore previous session by default', async () => {
      page = await render(<pos-app>item body</pos-app>);

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockHandleIncomingRedirect).toHaveBeenCalledWith(false);
    });

    it('restores previous session if prop tells so', async () => {
      page = await render(<pos-app restore-previous-session>item body</pos-app>);

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockHandleIncomingRedirect).toHaveBeenCalledWith(true);
    });

    it('does not restore previous session if prop states explicitly not to', async () => {
      page = await render(<pos-app restore-previous-session={false}>item body</pos-app>);

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockHandleIncomingRedirect).toHaveBeenCalledWith(false);
    });

    it('fires session-restored event', async () => {
      const onSessionRestored = vi.fn();
      page = await render(<pos-app>item body</pos-app>);

      page.root.addEventListener('pod-os:session-restored', onSessionRestored);

      await page.waitForChanges();

      sessionRestoredCallback('https://origin-url.test');

      expect(onSessionRestored).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            url: 'https://origin-url.test',
          },
        }),
      );
    });

    it('recovers from incoming redirect failure', async () => {
      mockHandleIncomingRedirect.mockRejectedValue('Simulated failure handling incoming redirect');
      page = await render(<pos-app>app body</pos-app>);

      expect(page.instance.loading).toBe(false);
      expect(page.root).toEqualHtml(`
        <pos-app class="hydrated">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          app body
        </pos-app>
      `);
    });
  });

  describe('local settings', () => {
    let sessionInfo$: BehaviorSubject<SessionInfo>;
    beforeEach(() => {
      localSettings.dispose();
      sessionInfo$ = new BehaviorSubject<SessionInfo>({ isLoggedIn: false, webId: '' });
      vi.resetAllMocks();

      (BrowserSession as Mock).mockImplementation(
        // @ts-ignore
        class {
          onSessionRestore = () => {};
          handleIncomingRedirect = vi.fn();
        },
      );

      (createPodOS as Mock).mockReturnValue({
        observeSession: () => sessionInfo$,
      });
    });

    it('creates PodOS instance with default settings', async () => {
      const page = await render(<pos-app>item body</pos-app>);

      expect(createPodOS).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          offlineCache: false,
        }),
      );

      page.instance.disconnectedCallback();
    });

    it('creates PodOS instance with stored settings', async () => {
      localSettings.state.offlineCache = true;
      const page = await render(<pos-app>item body</pos-app>);

      expect(createPodOS).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          offlineCache: true,
        }),
      );
      page.instance.disconnectedCallback();
    });

    it('recreates PodOS instance with updated settings', async () => {
      const page = await render(<pos-app>item body</pos-app>);

      expect(createPodOS).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          offlineCache: false,
        }),
      );

      localSettings.state.offlineCache = true;

      expect(createPodOS).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          offlineCache: true,
        }),
      );

      page.instance.disconnectedCallback();
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('indicates loading when signed in, until profile has been fetched', async () => {
      let finishFetchingProfile: (value?: unknown) => void = () => null;
      (BrowserSession as Mock).mockImplementation(
        // @ts-ignore
        class {
          onSessionRestore = () => null;
          handleIncomingRedirect = vi.fn();
        },
      );
      (createPodOS as Mock).mockReturnValue({
        observeSession: () => new BehaviorSubject({ isLoggedIn: true, webId: 'https://pod.test/alice#me' }),
        fetchProfile: () => new Promise(resolve => (finishFetchingProfile = resolve)),
      });
      const page = await render(
        <pos-app>
          <div>app body</div>
        </pos-app>,
      );

      expect(page.instance.loading).toBe(true);
      expect(page.root).toEqualHtml(`
        <pos-app class="hydrated">
          <mock:shadow-root>
            <sl-progress-bar indeterminate></sl-progress-bar>
          </mock:shadow-root>
          <div>
            app body
          </div>
        </pos-app>
      `);
      finishFetchingProfile();
      await page.waitForChanges();
      expect(page.instance.loading).toBe(false);
    });

    it('shows slot directly, when not signed in', async () => {
      (BrowserSession as Mock).mockImplementation(
        // @ts-ignore
        class {
          onSessionRestore = () => null;
          handleIncomingRedirect = vi.fn();
        },
      );
      (createPodOS as Mock).mockReturnValue({
        observeSession: () => new BehaviorSubject({ isLoggedIn: false, webId: '' }),
        fetchProfile: null,
      });
      const page = await render(<pos-app>app body</pos-app>);

      expect(page.instance.loading).toBe(false);
      expect(page.root).toEqualHtml(`
        <pos-app class="hydrated">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          app body
        </pos-app>
      `);
    });
  });

  describe('loaded event', () => {
    it('fires loaded event after the component has fully loaded', async () => {
      (BrowserSession as Mock).mockImplementation(
        // @ts-ignore
        class {
          authenticatedFetch = 'fake authenticated fetch';
          onSessionRestore = () => null;
          handleIncomingRedirect = vi.fn();
        },
      );
      const os = {
        observeSession: () => new BehaviorSubject({ isLoggedIn: true, webId: 'https://pod.test/alice#me' }),
        fetchProfile: () => {},
      };
      (createPodOS as Mock).mockReturnValue(os);

      const onLoaded = vi.fn();
      document.addEventListener('pod-os:loaded', onLoaded);
      const page = await render(<pos-app>app body</pos-app>);

      await page.waitForChanges();

      expect(onLoaded).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            os,
            authenticatedFetch: 'fake authenticated fetch',
          },
        }),
      );
    });
  });
});
