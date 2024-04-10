jest.mock('../../pod-os', () => ({
  createPodOS: jest.fn(),
}));

import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
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
