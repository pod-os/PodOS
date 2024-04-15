jest.mock('../../pod-os', () => ({
  createPodOS: jest.fn(),
}));

import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { when } from 'jest-when';
import { PosApp } from './pos-app';
import { createPodOS } from '../../pod-os';

describe('pos-app', () => {
  describe('load preferences', () => {
    const mockFetchProfile = jest.fn();
    let trackSessionCallback;

    beforeEach(() => {
      jest.resetAllMocks();

      (createPodOS as jest.Mock).mockReturnValue({
        handleIncomingRedirect: () => {},
        trackSession: callback => (trackSessionCallback = callback),
        fetchProfile: mockFetchProfile,
      });
    });

    describe('load preferences', () => {
      it('does not load the preferences before login', async () => {
        await newSpecPage({
          components: [PosApp],
          html: `<pos-app>item body</pos-app>`,
          supportsShadowDom: false,
        });

        trackSessionCallback({
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

        trackSessionCallback({
          isLoggedIn: true,
          webId: 'https://pod.test/alice#me',
        });

        expect(mockFetchProfile).toHaveBeenCalledWith('https://pod.test/alice#me');
      });
    });

    describe('communicates session changes', () => {
      describe('on login', () => {
        it('fires session-changed event with user data', async () => {
          const onSessionChanged = jest.fn();
          const page = await newSpecPage({
            components: [PosApp],
            html: `<pos-app>item body</pos-app>`,
            supportsShadowDom: false,
          });

          when(mockFetchProfile).calledWith('https://pod.test/alice#me').mockResolvedValue('mocked WebIdProfile');

          page.root.addEventListener('pod-os:session-changed', onSessionChanged);

          trackSessionCallback(
            {
              isLoggedIn: true,
              webId: 'https://pod.test/alice#me',
            },
            'mock authenticated fetch',
          );

          await page.waitForChanges();

          expect(onSessionChanged).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                isLoggedIn: true,
                webId: 'https://pod.test/alice#me',
                profile: 'mocked WebIdProfile',
                authenticatedFetch: 'mock authenticated fetch',
              },
            }),
          );
        });

        it('fires login event', async () => {
          const onLogin = jest.fn();
          const page = await newSpecPage({
            components: [PosApp],
            html: `<pos-app>item body</pos-app>`,
            supportsShadowDom: false,
          });

          when(mockFetchProfile).calledWith('https://pod.test/alice#me').mockResolvedValue('mocked WebIdProfile');

          page.root.addEventListener('pod-os:login', onLogin);

          trackSessionCallback(
            {
              isLoggedIn: true,
              webId: 'https://pod.test/alice#me',
            },
            'mock authenticated fetch',
          );

          await page.waitForChanges();

          expect(onLogin).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                isLoggedIn: true,
                webId: 'https://pod.test/alice#me',
                profile: 'mocked WebIdProfile',
                authenticatedFetch: 'mock authenticated fetch',
              },
            }),
          );
        });
      });

      describe('on logout', () => {
        it('fires session-changed event', async () => {
          const onSessionChanged = jest.fn();
          const page = await newSpecPage({
            components: [PosApp],
            html: `<pos-app>item body</pos-app>`,
            supportsShadowDom: false,
          });

          when(mockFetchProfile).calledWith('https://pod.test/alice#me').mockResolvedValue('mocked WebIdProfile');

          page.root.addEventListener('pod-os:session-changed', onSessionChanged);

          trackSessionCallback({
            isLoggedIn: false,
          });

          await page.waitForChanges();

          expect(onSessionChanged).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                isLoggedIn: false,
              },
            }),
          );
        });

        it('fires logout event', async () => {
          const onLogout = jest.fn();
          const page = await newSpecPage({
            components: [PosApp],
            html: `<pos-app>item body</pos-app>`,
            supportsShadowDom: false,
          });

          when(mockFetchProfile).calledWith('https://pod.test/alice#me').mockResolvedValue('mocked WebIdProfile');

          page.root.addEventListener('pod-os:logout', onLogout);

          trackSessionCallback({
            isLoggedIn: false,
          });

          await page.waitForChanges();

          expect(onLogout).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                isLoggedIn: false,
              },
            }),
          );
        });
      });
    });

    describe('load module', () => {
      const mockLoadContactsModule = jest.fn();

      beforeEach(() => {
        jest.resetAllMocks();
        (createPodOS as jest.Mock).mockReturnValue({
          handleIncomingRedirect: () => {},
          trackSession: () => {},
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
});
