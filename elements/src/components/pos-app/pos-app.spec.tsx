jest.mock('../../authentication', () => ({
  BrowserSession: jest.fn(),
}));

jest.mock('../../pod-os', () => ({
  createPodOS: jest.fn(),
}));

import { localSettings } from '../../store/settings';

import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { createPodOS } from '../../pod-os';
import { PosApp } from './pos-app';
import { BrowserSession } from '../../authentication';

describe('pos-app', () => {
  describe('load preferences', () => {
    const mockFetchProfile = jest.fn();
    let sessionInfo$;
    let page;

    beforeEach(() => {
      sessionInfo$ = new BehaviorSubject({ isLoggedIn: false, webId: '' });
      jest.resetAllMocks();

      (BrowserSession as jest.Mock).mockImplementation(() => {
        return {
          onSessionRestore: () => {},
          handleIncomingRedirect: () => {},
        };
      });

      (createPodOS as jest.Mock).mockReturnValue({
        observeSession: () => sessionInfo$,
        fetchProfile: mockFetchProfile,
      });
    });

    afterEach(() => {
      page.rootInstance.disconnectedCallback();
    });

    it('does not load the preferences before login', async () => {
      page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
        supportsShadowDom: false,
      });

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockFetchProfile).not.toHaveBeenCalled();
    });

    it('loads the preferences after login', async () => {
      page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
        supportsShadowDom: false,
      });

      sessionInfo$.next({
        isLoggedIn: true,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockFetchProfile).toHaveBeenCalledWith('https://pod.test/alice#me');
    });
  });

  describe('load module', () => {
    const mockLoadContactsModule = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();
      (BrowserSession as jest.Mock).mockImplementation(() => {
        return {
          onSessionRestore: () => {},
          handleIncomingRedirect: () => {},
        };
      });
      (createPodOS as jest.Mock).mockReturnValue({
        observeSession: () => EMPTY,
        loadContactsModule: mockLoadContactsModule,
      });
    });

    it('loads the contacts module', async () => {
      // given
      const loadContactsModule = jest.fn().mockResolvedValue('fake contacts module');
      const receiver = jest.fn();
      const page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
        supportsShadowDom: false,
      });
      page.rootInstance.os = {
        loadContactsModule,
      };

      // when
      fireEvent(page.root, new CustomEvent('pod-os:module', { detail: { module: 'contacts', receiver } }));
      await page.waitForChanges();

      // then
      expect(loadContactsModule).toHaveBeenCalled();
      expect(receiver).toHaveBeenCalledWith('fake contacts module');
      page.rootInstance.disconnectedCallback();
    });

    it('throws an error if module is unknown', async () => {
      const app = new PosApp();
      await expect(() =>
        app.loadModule(
          new CustomEvent('pod-os:module', {
            detail: {
              module: 'unknown-module-name',
              receiver: () => {},
            },
          }),
        ),
      ).rejects.toEqual(new Error('Unknown module "unknown-module-name"'));
    });
  });

  describe('handle incoming redirect', () => {
    const mockHandleIncomingRedirect = jest.fn();
    let sessionRestoredCallback;
    let sessionInfo$;
    let page;

    beforeEach(() => {
      sessionInfo$ = new BehaviorSubject({ isLoggedIn: false, webId: '' });
      jest.resetAllMocks();

      (BrowserSession as jest.Mock).mockImplementation(() => {
        return {
          onSessionRestore: callback => (sessionRestoredCallback = callback),
          handleIncomingRedirect: mockHandleIncomingRedirect,
        };
      });

      (createPodOS as jest.Mock).mockReturnValue({
        observeSession: () => sessionInfo$,
        fetchProfile: () => null,
      });
    });

    afterEach(() => {
      page.rootInstance.disconnectedCallback();
    });

    it('does not restore previous session by default', async () => {
      page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
        supportsShadowDom: false,
      });

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockHandleIncomingRedirect).toHaveBeenCalledWith(false);
    });

    it('restores previous session if prop tells so', async () => {
      page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app restore-previous-session>item body</pos-app>`,
        supportsShadowDom: false,
      });

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockHandleIncomingRedirect).toHaveBeenCalledWith(true);
    });

    it('does not restore previous session if prop states explicitly not to', async () => {
      page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app restore-previous-session='false'>item body</pos-app>`,
        supportsShadowDom: false,
      });

      sessionInfo$.next({
        isLoggedIn: false,
        webId: 'https://pod.test/alice#me',
      });

      expect(mockHandleIncomingRedirect).toHaveBeenCalledWith(false);
    });

    it('fires session-restored event', async () => {
      const onSessionRestored = jest.fn();
      page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
        supportsShadowDom: false,
      });

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
      mockHandleIncomingRedirect.mockRejectedValue(new Error('Simulated failure handling incoming redirect'));
      page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>app body</pos-app>`,
        supportsShadowDom: true,
      });
      expect(page.rootInstance.loading).toBe(false);
      expect(page.root).toEqualHtml(`
        <pos-app>
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          app body
        </pos-app>
      `);
    });
  });

  describe('local settings', () => {
    let sessionInfo$;
    beforeEach(() => {
      localSettings.dispose();
      sessionInfo$ = new BehaviorSubject({ isLoggedIn: false, webId: '' });
      jest.resetAllMocks();

      (BrowserSession as jest.Mock).mockImplementation(() => {
        return {
          onSessionRestore: () => {},
          handleIncomingRedirect: jest.fn(),
        };
      });

      (createPodOS as jest.Mock).mockReturnValue({
        observeSession: () => sessionInfo$,
      });
    });

    it('creates PodOS instance with default settings', async () => {
      const page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
      });

      expect(createPodOS).toHaveBeenCalledWith(expect.anything(), {
        offlineCache: false,
      });

      page.rootInstance.disconnectedCallback();
    });

    it('creates PodOS instance with stored settings', async () => {
      localSettings.state.offlineCache = true;
      const page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
      });

      expect(createPodOS).toHaveBeenCalledWith(expect.anything(), {
        offlineCache: true,
      });
      page.rootInstance.disconnectedCallback();
    });

    it('recreates PodOS instance with updated settings', async () => {
      const page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>item body</pos-app>`,
      });

      expect(createPodOS).toHaveBeenCalledWith(expect.anything(), {
        offlineCache: false,
      });

      localSettings.state.offlineCache = true;

      expect(createPodOS).toHaveBeenCalledWith(expect.anything(), {
        offlineCache: true,
      });

      page.rootInstance.disconnectedCallback();
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('indicates loading when signed in, until profile has been fetched', async () => {
      let finishFetchingProfile = null;
      (BrowserSession as jest.Mock).mockImplementation(() => {
        return {
          onSessionRestore: () => null,
          handleIncomingRedirect: jest.fn(),
        };
      });
      (createPodOS as jest.Mock).mockReturnValue({
        observeSession: () => new BehaviorSubject({ isLoggedIn: true, webId: 'https://pod.test/alice#me' }),
        fetchProfile: () => new Promise(resolve => (finishFetchingProfile = resolve)),
      });
      const page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app><div>app body</div></pos-app>`,
        supportsShadowDom: true,
      });
      expect(page.rootInstance.loading).toBe(true);
      expect(page.root).toEqualHtml(`
        <pos-app>
          <mock:shadow-root>
            <ion-progress-bar type="indeterminate"></ion-progress-bar>
          </mock:shadow-root>
          <div>
            app body
          </div>
        </pos-app>
      `);
      finishFetchingProfile();
      await page.waitForChanges();
      expect(page.rootInstance.loading).toBe(false);
    });

    it('shows slot directly, when not signed in', async () => {
      let finishFetchingProfile = null;
      (BrowserSession as jest.Mock).mockImplementation(() => {
        return {
          onSessionRestore: () => null,
          handleIncomingRedirect: jest.fn(),
        };
      });
      (createPodOS as jest.Mock).mockReturnValue({
        observeSession: () => new BehaviorSubject({ isLoggedIn: false, webId: '' }),
        fetchProfile: null,
      });
      const page = await newSpecPage({
        components: [PosApp],
        html: `<pos-app>app body</pos-app>`,
        supportsShadowDom: true,
      });
      expect(page.rootInstance.loading).toBe(false);
      expect(page.root).toEqualHtml(`
        <pos-app>
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          app body
        </pos-app>
      `);
    });
  });
});
