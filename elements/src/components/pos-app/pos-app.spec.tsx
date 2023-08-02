jest.mock('../../pod-os', () => ({
  createPodOS: jest.fn(),
}));

import { newSpecPage } from '@stencil/core/testing';
import { PosApp } from './pos-app';
import { createPodOS } from '../../pod-os';

describe('pos-app', () => {
  describe('load preferences', () => {
    const mockLoadPreferences = jest.fn();
    let trackSessionCallback;

    beforeEach(() => {
      jest.resetAllMocks();

      (createPodOS as jest.Mock).mockReturnValue({
        handleIncomingRedirect: () => {},
        trackSession: callback => (trackSessionCallback = callback),
        loadPreferences: mockLoadPreferences,
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

      expect(mockLoadPreferences).not.toHaveBeenCalled();
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

      expect(mockLoadPreferences).toHaveBeenCalledWith('https://pod.test/alice#me');
    });
  });
});
