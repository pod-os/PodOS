jest.mock('../../pod-os', () => ({
  createPodOS: jest.fn(),
}));

import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { createPodOS } from '../../pod-os';
import { PosApp } from './pos-app';

describe('pos-app', () => {
  describe('load preferences', () => {
    const mockFetchProfile = jest.fn();
    let sessionInfo$;

    beforeEach(() => {
      sessionInfo$ = new BehaviorSubject({ isLoggedIn: false, webId: '' });
      jest.resetAllMocks();

      (createPodOS as jest.Mock).mockReturnValue({
        handleIncomingRedirect: () => {},
        observeSession: () => sessionInfo$,
        onSessionRestore: () => {},
        fetchProfile: mockFetchProfile,
      });
    });

    it('does not load the preferences before login', async () => {
      await newSpecPage({
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
      await newSpecPage({
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

    describe('load module', () => {
      const mockLoadContactsModule = jest.fn();

      beforeEach(() => {
        jest.resetAllMocks();
        (createPodOS as jest.Mock).mockReturnValue({
          handleIncomingRedirect: () => {},
          observeSession: () => EMPTY,
          onSessionRestore: () => {},
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
  });

  describe('handle incoming redirect', () => {
    const mockHandleIncomingRedirect = jest.fn();
    let sessionRestoredCallback;
    let sessionInfo$;

    beforeEach(() => {
      sessionInfo$ = new BehaviorSubject({ isLoggedIn: false, webId: '' });
      jest.resetAllMocks();

      (createPodOS as jest.Mock).mockReturnValue({
        handleIncomingRedirect: mockHandleIncomingRedirect,
        observeSession: () => sessionInfo$,
        onSessionRestore: callback => (sessionRestoredCallback = callback),
        fetchProfile: () => null,
      });
    });

    it('does not restore previous session by default', async () => {
      await newSpecPage({
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
      await newSpecPage({
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
      await newSpecPage({
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
      const page = await newSpecPage({
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
  });
});
